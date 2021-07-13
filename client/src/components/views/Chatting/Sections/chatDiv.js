import React,{useState} from "react";
import { Comment, Tooltip, Avatar } from 'antd';
import axios from "axios";
import { connect } from "react-redux";
import { USER_SERVER } from '../../../Config';

function ChatCard(props) {
    const [userdata,setuserdata]=useState("");
    const [mar,setmar]=useState(false);
    const currtime= props.time;
    axios.get(`${USER_SERVER}/data`)
    .then(response=>{
   if (response.status === 200) {
    setuserdata(response.data);
    if(props.sender.email===userdata.email){
        setmar(true);
    }
   } else {
     alert('Failed Failed')
   }
  });
  
    return (
        <div style={{width:"20%",minWidth:'250px', position:"relative",left:!mar? "0":"60%",backgroundColor:mar?'#e9eaf6':'white',margin:'1%'}}>
           
            <Comment
                author={ mar? "":props.sender.name}
                
                avatar={ 
                    !mar?
                   <Avatar src={props.sender.image} alt={props.sender.name}/>
                   :
                   <div></div>
                }
                content={
                    props.message.substring(0, 36) === "https://res.cloudinary.com/digvkvltj" ?
                        props.message.substring(36,50) === '/video/upload/' ?
                            <video
                                style={{ maxWidth: '100%' }}
                                src={props.message} alt="video"
                                type="video/mp4" controls
                            />
                            :
                            <img
                                style={{ maxWidth: '200px',paddingLeft:'30px' }}
                                src={props.message}
                                alt="img"
                            />
                        :
                        <p>
                            {props.message}
                        </p>
                }
                datetime={
                        <span style={{color:"#565658"}}>{currtime}</span>
                    
                }
            />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chats: state.chat
    }
}

export default connect(mapStateToProps)(ChatCard);
