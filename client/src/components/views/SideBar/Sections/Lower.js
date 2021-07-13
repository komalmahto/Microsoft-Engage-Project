import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import HomeIcon from '@material-ui/icons/Home';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import "../SideBar.css";
function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <div className="tab">
      <a className="MenuItem_a" href="/">
      <h6  href="/" className="MenuItem" key="mail" >
        <div> <PersonIcon className="icon" /></div>
        <div className="MenuItem_a" >Signin</div>
      </h6>
      </a>
      <a className="MenuItem_a" href="/register">
      <h6  className="MenuItem" key="mail" >
      <div> <PersonAddIcon className="icon" /></div>
      <div className="MenuItem_a">Signup</div>
     </h6>
      </a>
     
      </div>
    )
  } else {
    return (
      <a className="MenuItem_a" onClick={logoutHandler}>
      <h6  className="MenuItem" key="mail" >
      <div> <ExitToAppIcon className="icon" /></div>
      <div className="MenuItem_a">Logout</div>
     </h6>
      </a>
     
      // //<Menu mode={props.mode}>
      //   <MenuItem className="MenuItem" key="logout">
      //     <ExitToAppIcon /><a lassName="MenuItem_a" onClick={logoutHandler}>Logout</a>
      //   </MenuItem>
     // </Menu>
    )
  }
}

export default withRouter(RightMenu);
