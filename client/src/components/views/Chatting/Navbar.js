import React,{useState,useEffect} from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import { USER_SERVER } from '../../Config';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    color:"white",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%"
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  }
}));

function PrimarySearchAppBar() {
const [userdata,setuserdata]=useState("");



  const callHome = ()=>{
    axios.get(`${USER_SERVER}/data`)
   .then(response=>{
  if (response.status === 200) {
    setuserdata(response.data);
  } else {
    alert('Failed Failed')
  }
 });
  }

  useEffect(() => {
    callHome(); 
  }, [])
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
      <div>
      <MenuItem >{userdata.name}</MenuItem>
      <MenuItem >{userdata.email}</MenuItem>
        
        
       
      </div>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" >
        <Toolbar>
          <h2 style={{fontSize:"25px",color:"white",fontWeight:"bolder"}}>Microsoft Teams</h2>
          <div className={classes.grow} />
          <IconButton onClick={callHome,handleProfileMenuOpen} color="inherit">
            <Avatar src={userdata.image}    />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
export default PrimarySearchAppBar;