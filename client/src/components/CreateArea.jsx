// import React, { useState } from "react";
// import AddIcon from "@material-ui/icons/Add";
// import Fab from "@material-ui/core/Fab";
// import Zoom from "@material-ui/core/Zoom";


// function CreateArea(props) {
//   const [isExpanded, setExpanded] = useState(false);

//   const [note, setNote] = useState({
//     title: "",
//     content: ""
//   });

//   function handleChange(event) {
//     const { name, value } = event.target;

//     setNote(prevNote => {
//       return {
//         ...prevNote,
//         [name]: value
//       };
//     });
//   }

//   function submitNote(event) {
  
  
//     props.onAdd(note);
//     setNote({
//       title: "",
//       content: ""
//     });
//     event.preventDefault();
//   }

//   function expand() {
//     setExpanded(true);
//   }

//   return (
//     <div>
//       <form className="create-note">
//         {isExpanded && (
//           <input
//             name="title"
//             onChange={handleChange}
//             value={note.title}
//             placeholder="Title"
//           />
//         )}

//         <textarea
//           name="content"
//           onClick={expand}
//           onChange={handleChange}
//           value={note.content}
//           placeholder="Take a note..."
//           rows={isExpanded ? 3 : 1}
//         /> 
//         <Zoom in={isExpanded}>
//           <Fab onClick={submitNote}>
//             <AddIcon />
//           </Fab>
//         </Zoom>
//       </form>
//     </div>
//   );
// }

// export default CreateArea;

import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import axios from "axios";
import { USER_SERVER } from './Config';

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }
    const obj={
      email:props.email,
      ...note
    }
    axios.post(`${USER_SERVER}/make_notes`,obj,config)
    .then(response=>{
    if (response.status === 200) {
        console.log(response.data.data)
    props.onAdd(response.data.data);
    } else {
     alert('Failed Failed')
    }
  })
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
