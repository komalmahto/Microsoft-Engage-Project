import React,{useState} from 'react';
import LeftMenu from './Sections/Upper';
import RightMenu from './Sections/Lower';
import "./SideBar.css";

function SideBar({user}) {
 return (
    <nav className="menu" >
       <LeftMenu mode="vertical" />
       <RightMenu mode="vertical" />
      
    </nav>
  )
}

export default SideBar;