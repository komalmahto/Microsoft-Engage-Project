import React,{useState,useEffect} from 'react'
import io from "socket.io-client";
import { connect } from "react-redux";
const socket = io.connect('http://localhost:5000')

function UsersOnline() {
    //console.log(user);
    const [onlineUsers,setonlineUsers]=useState([]);
    socket.on("broadcast",(data)=>{
        console.log(data);
        const uniqueUsers= [...new Set(data)];
       setonlineUsers(uniqueUsers);
       //console.log(message);
     })
    // useEffect(() => {
       
    // }, [])
    

    return (
        <div>
            {
                onlineUsers.map(user=>{
                    return <div>{user.name}</div>
                })
            }
        </div>
    )
}

const mapStateToProps = state => {
//     console.log(state.user);
//    console.log(state.chat);
   return {
       user: state.user,
       chats: state.chat
   }
}


export default connect(mapStateToProps)(UsersOnline);
//export default UsersOnline;

