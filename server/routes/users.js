const express = require('express'),
       router = express.Router(),
     { User } = require("../models/User"),
     { auth } = require("../middleware/auth"),
     { Note } = require("../models/note");
 cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get("/auth", auth, (req, res) => {
     var mydata=res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});


router.post("/", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

//notes route
router.post("/make_notes",async (req,res)=>{
    const note= new Note({
        email:res.req.body.email,
        title:res.req.body.title,
        content:res.req.body.content
    });
    try {
        const user= await User.find({email:res.req.body.email});
        if(user)
        {
            try {
                const savedNote = await note.save();
                const allnotes = await Note.find({email:res.req.body.email});
                res.json({data:allnotes});
            } catch (error) {
                console.log("error in updating user's note",error)
            } 
        }else{
            console.log("user not found")
        }
    } catch (error) {
        console.log(error)
    }
    
});

// delete users's note
router.post("/make_notes/delete_note",async (req,res)=>{
    try {
        
        const allnotes = await Note.find({email:res.req.body.email});
        const spliced =  allnotes[res.req.body.id];
        await Note.deleteOne({_id:spliced._id});
        const deletednotes = await Note.find({email:res.req.body.email});
        
        res.json({data:deletednotes});
    } catch (error) {
        console.log("error in hitting make_notes/delete_note",error)
    }
});
router.get("/data",auth ,(req, res) => {
    res.send(req.user);
});

module.exports = router;
