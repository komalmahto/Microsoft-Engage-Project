
import React, { Component } from 'react';
import { Input, Button } from '@material-ui/core';
import { connect } from "react-redux";
import Upperbar from './Chatting/Navbar';
import NavBar from './SideBar/SideBar';

class Meet extends Component {
  	constructor (props) {
		super(props)
		this.state = {
			url: ''
		}
	}

	handleChange = (e) => this.setState({ url: e.target.value })

	join = () => {
		if (this.state.url !== "") {
			var url = this.state.url.split("/")
			window.location.href = `/meet/${url[url.length-1]}`
		} else {
			var url = Math.random().toString(36).substring(2, 7)
			window.location.href = `/meet/${url}`
		}
	}

	render() {
		return (
			<div>
		 <Upperbar/>
          <div style={{display:'flex'}}>
		  <div style={{flex:"1"}}>
		  <NavBar/>
		  </div>
			<div style={{flex:"11",textAlign: "center", padding:"10% 0"}}>
			<div className="container2">
				<div >
					<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>Start or join a meeting</p>
					<Input placeholder="Create Your Own URL" onChange={e => this.handleChange(e)} />
					<Button variant="contained" color="primary" onClick={this.join} style={{margin:"10px" }}>Go!</Button>
				</div>
			</div>
			</div>
		  </div>
			</div>
		)
	}
}
const mapStateToProps = state => {
   
    return {
        user: state.user,
        chats: state.chat
    }
}


export default connect(mapStateToProps)(Meet);