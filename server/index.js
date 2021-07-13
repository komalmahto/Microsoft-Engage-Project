const express = require("express"),
     mongoose = require("mongoose"),
          app = express(),
 cookieParser = require("cookie-parser"),
         cors = require("cors"),
       server = require("http").createServer(app),
           io = require("socket.io")(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
      }),
       multer = require("multer"),
         path = require("path"),
           fs = require("fs"),
          xss = require("xss");
          const config = require("./config/key");

const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected...'))
  .catch(err => console.log(err));

app.use(cors(
    {
        origin: "*",
        methods: ["GET", "POST"]
    }
));
app.use(cookieParser());
app.use(express.json());

const { Chat } = require("./models/Chat");


app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));
app.use('/uploads', express.static('../uploads'));

const sanitizeString = (str) => {
  return xss(str)
}
 
//Multer
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${file.originalname}`)
//   },
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname)
//     if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
//       return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
//     }
//     cb(null, true)
//   }
// })

 
// var upload = multer({ storage: storage }).single("file");

// app.post("/api/chat/uploadfiles", auth ,(req, res) => {
  
//    return res.json({ success: true, url:  })
//   upload(req, res, err => {
//     if(err) {
//       console.log("ni upload");
//       return res.json({ success: false, err })
//     }else{
//       console.log("hua upload");
//     return res.json({ success: true, url: res.req.file.path });
//     }
//   })
// });

let connections = {}
let messages = {}



io.on("connection", socket => {

  socket.on("new-message", msgData => {
    connect.then(db => {
      try {
          let chat = new Chat({ message: msgData.chatMessage, sender:msgData.userId, type: msgData.type,time:msgData.nowTime })
          
          chat.save((err, data) => {
           
            if(err) return res.json({ success: false, err })
           
            Chat.find({ "_id": data._id })
            .populate("sender")
            .exec((err, data)=> {
                return io.emit("back-message", data);
            })
          })
      } catch (error) {
        console.error(error);
      }
    });
   });

   socket.on('join-call', (path) => {
    if(connections[path] === undefined){
        connections[path] = []
    }
    connections[path].push(socket.id)

    

    for(let a = 0; a < connections[path].length; ++a){
        io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
    }

    if(messages[path] !== undefined){
        for(let a = 0; a < messages[path].length; ++a){
            io.to(socket.id).emit("chat-message", messages[path][a]['data'], 
                messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
        }
    }

    
})

socket.on('signal', (send, message) => {
    io.to(send).emit('signal', socket.id, message)
})

socket.on('chat-message', (data, sender) => {
    data = sanitizeString(data)
    sender = sanitizeString(sender)

    var key
    var ok = false
    for (const [k, v] of Object.entries(connections)) {
        for(let a = 0; a < v.length; ++a){
            if(v[a] === socket.id){
                key = k
                ok = true
            }
        }
    }

    if(ok === true){
        if(messages[key] === undefined){
            messages[key] = []
        }
        messages[key].push({"sender": sender, "data": data, "socket-id-sender": socket.id})
       

        for(let a = 0; a < connections[key].length; ++a){
            io.to(connections[key][a]).emit("chat-message", data, sender, socket.id)
        }
    }
})

socket.on('disconnect', () => {
   
    var key
    for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
        for(let a = 0; a < v.length; ++a){
            if(v[a] === socket.id){
                key = k

                for(let a = 0; a < connections[key].length; ++a){
                    io.to(connections[key][a]).emit("user-left", socket.id)
                }
        
                var index = connections[key].indexOf(socket.id)
                connections[key].splice(index, 1)

               

                if(connections[key].length === 0){
                    delete connections[key]
                }
            }
        }
    }
})
});












// io.on('connection', (socket) => {

//   socket.on('join-call', (path) => {
//       if(connections[path] === undefined){
//           connections[path] = []
//       }
//       connections[path].push(socket.id)

      

//       for(let a = 0; a < connections[path].length; ++a){
//           io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
//       }

//       if(messages[path] !== undefined){
//           for(let a = 0; a < messages[path].length; ++a){
//               io.to(socket.id).emit("chat-message", messages[path][a]['data'], 
//                   messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
//           }
//       }

      
//   })

//   socket.on('signal', (send, message) => {
//       io.to(send).emit('signal', socket.id, message)
//   })

//   socket.on('chat-message', (data, sender) => {
//       data = sanitizeString(data)
//       sender = sanitizeString(sender)

//       var key
//       var ok = false
//       for (const [k, v] of Object.entries(connections)) {
//           for(let a = 0; a < v.length; ++a){
//               if(v[a] === socket.id){
//                   key = k
//                   ok = true
//               }
//           }
//       }

//       if(ok === true){
//           if(messages[key] === undefined){
//               messages[key] = []
//           }
//           messages[key].push({"sender": sender, "data": data, "socket-id-sender": socket.id})
         

//           for(let a = 0; a < connections[key].length; ++a){
//               io.to(connections[key][a]).emit("chat-message", data, sender, socket.id)
//           }
//       }
//   })

//   socket.on('disconnect', () => {
     
//       var key
//       for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
//           for(let a = 0; a < v.length; ++a){
//               if(v[a] === socket.id){
//                   key = k

//                   for(let a = 0; a < connections[key].length; ++a){
//                       io.to(connections[key][a]).emit("user-left", socket.id)
//                   }
          
//                   var index = connections[key].indexOf(socket.id)
//                   connections[key].splice(index, 1)

                 

//                   if(connections[key].length === 0){
//                       delete connections[key]
//                   }
//               }
//           }
//       }
//   })
// })







//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder
  app.use(express.static("client/build"));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Running at ${port}`)
});