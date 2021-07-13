// import React, { useState } from "react";
// import Header from "./Header";
// import Note from "./Note";
// import CreateArea from "./CreateArea";
// import "./keeper.css";
// import Navbar from "./views/Chatting/Navbar";
// import Sidebar from  "./views/SideBar/SideBar";



// function Keeper() {
//   const [notes, setNotes] = useState([]);

//   function addNote(newNote) {
//     setNotes(prevNotes => {
//       return [...prevNotes, newNote];
//     });
//   }

//   function deleteNote(id) {
//     setNotes(prevNotes => {
//       return prevNotes.filter((noteItem, index) => {
//         return index !== id;
//       });
//     });
//   }

//   return (
//       <>
//       <Navbar/>
//       <Sidebar/>
//     <div style={{display:'flex',marginLeft:"10%"}}>
//       <div style={{flex:'0.9'}}>
      
//       <CreateArea onAdd={addNote} />
//       {notes.map((noteItem, index) => {
//         return (
//           <Note
//             key={index}
//             id={index}
//             title={noteItem.title}
//             content={noteItem.content}
//             onDelete={deleteNote}
//           />
//         );
//       })}
     
//       </div>
//     </div>
//     </>
//   );
// }

// export default Keeper;
import React, { useState } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Note from "./Note";
import CreateArea from "./CreateArea";
import "./keeper.css";
import Navbar from "./views/Chatting/Navbar";
import Sidebar from  "./views/SideBar/SideBar";
import axios from "axios";
import { USER_SERVER } from './Config';

function Keeper(user) {
  const [notes, setNotes] = useState([]);




  function getemail()
  {
    if(user.userData && user.userData.email){
        console.log(user.userData.email);
      return user.userData.email;
    }
  }

  function addNote(newNote) {
    
    setNotes([...newNote]);
  }

  function deleteNote(id) {
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }
    const obj={
      email:getemail(),
      id:id,
    }

    axios.post(`${USER_SERVER}/make_notes/delete_note`,obj,config)
    .then(response=>{
      if (response.status === 200) {
        const newNotedeleted=response.data.data;
        setNotes([...newNotedeleted]);
      } else {
        alert('Failed Failed');
      }
     });
  }

  return (
      <>
      <Navbar/>
      <Sidebar/>
    <div style={{display:'flex',marginLeft:"10%"}}>
      <div style={{flex:'0.9'}}>
      
      <CreateArea onAdd={addNote}  email={getemail()}/>
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
     
      </div>
    </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
      user: state.user,
      
  }
}


export default connect(mapStateToProps)(Keeper);