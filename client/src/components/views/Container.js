import React from 'react'
import SideBar from './SideBar/SideBar'
import Upperbar from './Chatting/Navbar'


function Container() {
   

    return (
        <div>
        <Upperbar/>
        <SideBar/>
        <div style={{marginLeft:"36%",marginTop:"5%"}}>
        <img style={{textAlign:'center'}} src="welcome.png" style={{width:'50%', height:'50%'}}/>
        <h5 style={{marginLeft:"5%",fontWeight:"bold"}}>Let's get the conversation started</h5>
        </div>
       
      </div>
    )
}




export default (Container);

