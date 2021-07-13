import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import HomeIcon from '@material-ui/icons/Home';
import ChatIcon from '@material-ui/icons/Chat';
import CreateIcon from '@material-ui/icons/Create';
import "../SideBar.css";
import VideoCallIcon from '@material-ui/icons/VideoCall';
function LeftMenu(props) {
  return (
    <div className="tab">
      <a className="MenuItem_a" href="/home">
      <h6  className="MenuItem" key="mail" >
      <div> <HomeIcon className="icon" /></div>
      <div className="MenuItem_a"> Home</div>
      </h6>
      </a>
     
     <a className="MenuItem_a" href="/chat">
     <h6  className="MenuItem" key="chat">
    <div> <ChatIcon className="icon"/></div>
    <div className="MenuItem_a">Chat</div>
    </h6>
     </a>
    <a className="MenuItem_a" href="/meet">
    <h6 className="MenuItem" key="meet">
    <div><VideoCallIcon className="icon"/></div>
    <div className="MenuItem_a">Teams</div>
    </h6>
    </a>
    <a className="MenuItem_a" href="/notes">
    <h6 className="MenuItem" key="meet">
    <div><CreateIcon className="icon"/></div>
    <div className="MenuItem_a">Notes</div>
    </h6>
    </a>
    
    </div>
  )
}

export default LeftMenu