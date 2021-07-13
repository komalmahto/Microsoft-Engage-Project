import "./Video.css"
import React, { Component} from 'react'
import io from 'socket.io-client'
import {IconButton, Badge, Input, Button} from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import CallEndIcon from '@material-ui/icons/CallEnd'
import ChatIcon from '@material-ui/icons/Chat'
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import { message } from 'antd'
import 'antd/dist/antd.css'
import { Row } from 'reactstrap'
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.css'

const server_url = "https://komalmahto-microsoft-teams.herokuapp.com"

var all_connections = {};

//Configuration
const peerConnectionConfig = {
	'iceServers': [
	    { 'urls': 'stun:stun.l.google.com:19302' },
	]
}
var _e = 0
var socket = null
var socket_id = null


class Video extends Component {
	constructor(props) {
		super(props)

		this.VideoRef = React.createRef()

		this.is_Video_Available = false
		this.is_Audio_Available = false

	// setting initial state

		this.state = {
			username:"",
			video: false,
			audio: false,
			isConn: true,
			is_Screen_Available: false,
			showModal: false,
			screen: false,
			messages: [],
			message: "",
		}
		all_connections = {}

		this.get_Permissions()
	}
    
	
	get_Permissions = async () => {
		try{
			await navigator.mediaDevices.getUserMedia({ video: true })
				.then(() => this.is_Video_Available = true)
				.catch(() => this.is_Video_Available = false)

			await navigator.mediaDevices.getUserMedia({ audio: true })
				.then(() => this.is_Audio_Available = true)
				.catch(() => this.is_Audio_Available = false)

			if (navigator.mediaDevices.getDisplayMedia) {
				this.setState({ is_Screen_Available: true })
			} else {
				this.setState({ is_Screen_Available: false })
			}

			if (this.is_Video_Available || this.is_Audio_Available) {
				navigator.mediaDevices.getUserMedia({ video: this.is_Video_Available, audio: this.is_Audio_Available })
					.then((stream) => {
						window.localStream = stream
						this.VideoRef.current.srcObject = stream
					})
					.then((stream) => {})
					.catch((e) => console.log(e))
			}
		} catch(e) { console.log(e) }
	}
  
//Getting Media
	getMedia = () => {
		
		this.setState({
			video: this.is_Video_Available,
			audio: this.is_Audio_Available
		}, () => {
			this.getUserMedia()
			this.socket_server()
		})
	}

	getUserMedia = () => {
		if ((this.state.video && this.is_Video_Available) || (this.state.audio && this.is_Audio_Available)) {
			navigator.mediaDevices.getUserMedia({ video: this.state.video, audio: this.state.audio })
				.then(this.getUserMediaSuccess)
				.then((stream) => {})
				.catch((e) => console.log(e))
		} else {
			try {
				let tracks = this.VideoRef.current.srcObject.getTracks()
				tracks.forEach(track => track.stop())
			} catch (e) {}
		}
	}

	getUserMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch(e) { console.log(e) }

		window.localStream = stream
		this.VideoRef.current.srcObject = stream

		for (let id in all_connections) {
			if (id === socket_id) continue

			all_connections[id].addStream(window.localStream)

			all_connections[id].createOffer().then((description) => {
				all_connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': all_connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				video: false,
				audio: false,
			}, () => {
				try {
					let tracks = this.VideoRef.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch(e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.VideoRef.current.srcObject = window.localStream

				for (let id in all_connections) {
					all_connections[id].addStream(window.localStream)

					all_connections[id].createOffer().then((description) => {
						all_connections[id].setLocalDescription(description)
							.then(() => {
								socket.emit('signal', id, JSON.stringify({ 'sdp': all_connections[id].localDescription }))
							})
							.catch(e => console.log(e))
					})
				}
			})
		})
	}

	getDislayMedia = () => {
		if (this.state.screen) {
			if (navigator.mediaDevices.getDisplayMedia) {
				navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
					.then(this.getDislayMediaSuccess)
					.then((stream) => {})
					.catch((e) => console.log(e))
			}
		}
	}

	getDislayMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch(e) { console.log(e) }

		window.localStream = stream
		this.VideoRef.current.srcObject = stream

		for (let id in all_connections) {
			if (id === socket_id) continue

			all_connections[id].addStream(window.localStream)

			all_connections[id].createOffer().then((description) => {
				all_connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': all_connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				screen: false,
			}, () => {
				try {
					let tracks = this.VideoRef.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch(e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.VideoRef.current.srcObject = window.localStream

				this.getUserMedia()
			})
		})
	}

	gotMessageFromServer = (fromId, message) => {
		var signal = JSON.parse(message)

		if (fromId !== socket_id) {
			if (signal.sdp) {
				all_connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
					if (signal.sdp.type === 'offer') {
						all_connections[fromId].createAnswer().then((description) => {
							all_connections[fromId].setLocalDescription(description).then(() => {
								socket.emit('signal', fromId, JSON.stringify({ 'sdp': all_connections[fromId].localDescription }))
							}).catch(e => console.log(e))
						}).catch(e => console.log(e))
					}
				}).catch(e => console.log(e))
			}

			if (signal.ice) {
				all_connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
			}
		}
	}

	changeCssVideos = (users_container) => {
		let widthMain = users_container.offsetWidth
		let minWidth = "30%"
		if ((widthMain * 30 / 100) < 300) {
			minWidth = "300px"
		}
		let minHeight = "40%"

		let height = String(100 / _e) + "%"
		let width = ""
		if(_e === 0 || _e === 1) {
			width = "100%"
			height = "100%"
		} else if (_e === 2) {
			width = "45%"
			height = "100%"
		} else if (_e === 3 || _e === 4) {
			width = "35%"
			height = "50%"
		} else {
			width = String(100 / _e) + "%"
		}

		let videos = users_container.querySelectorAll("video")
		for (let a = 0; a < videos.length; ++a) {
			videos[a].style.minWidth = minWidth
			videos[a].style.minHeight = minHeight
			videos[a].style.setProperty("width", width)
			videos[a].style.setProperty("height", height)
		}

		return {minWidth, minHeight, width, height}
	}

	socket_server = () => {
		socket = io.connect(server_url, { secure: true })

		socket.on('signal', this.gotMessageFromServer)

		socket.on('connect', () => {
			socket.emit('join-call', window.location.href)
			socket_id = socket.id

			socket.on('chat-message', this.addMessage)

			socket.on('user-left', (id) => {
				let video = document.querySelector(`[data-socket="${id}"]`)
				if (video !== null) {
					_e--
					video.parentNode.removeChild(video)

					let users_container = document.getElementById('users_container')
					this.changeCssVideos(users_container)
				}
			})

			socket.on('user-joined', (id, clients) => {
				clients.forEach((socketListId) => {
					all_connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
					all_connections[socketListId].onicecandidate = function (event) {
						if (event.candidate != null) {
							socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
						}
					}

					all_connections[socketListId].onaddstream = (event) => {
						var searchVidep = document.querySelector(`[data-socket="${socketListId}"]`)
						if (searchVidep !== null) { 
							searchVidep.srcObject = event.stream
						} else {
							_e = clients.length
							let users_container = document.getElementById('users_container')
							let cssMesure = this.changeCssVideos(users_container)

							let video = document.createElement('video')

							let css = {minWidth: cssMesure.minWidth, minHeight: cssMesure.minHeight, maxHeight: "100%", margin: "10px",
								 objectFit: "fill"}
							for(let i in css) video.style[i] = css[i]

							video.style.setProperty("width", cssMesure.width)
							video.style.setProperty("height", cssMesure.height)
							video.setAttribute('data-socket', socketListId)
							video.srcObject = event.stream
							video.autoplay = true
							video.playsinline = true

							users_container.appendChild(video)
						}
					}

					
					if (window.localStream !== undefined && window.localStream !== null) {
						all_connections[socketListId].addStream(window.localStream)
					} else {
						let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
						window.localStream = blackSilence()
						all_connections[socketListId].addStream(window.localStream)
					}
				})

				if (id === socket_id) {
					for (let id2 in all_connections) {
						if (id2 === socket_id) continue
						
						try {
							all_connections[id2].addStream(window.localStream)
						} catch(e) {}
			
						all_connections[id2].createOffer().then((description) => {
							all_connections[id2].setLocalDescription(description)
								.then(() => {
									socket.emit('signal', id2, JSON.stringify({ 'sdp': all_connections[id2].localDescription }))
								})
								.catch(e => console.log(e))
						})
					}
				}
			})
		})
	}

	silence = () => {
		let ctx = new AudioContext()
		let oscillator = ctx.createOscillator()
		let dst = oscillator.connect(ctx.createMediaStreamDestination())
		oscillator.start()
		ctx.resume()
		return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
	}
	black = ({ width = 640, height = 480 } = {}) => {
		let canvas = Object.assign(document.createElement("canvas"), { width, height })
		canvas.getContext('2d').fillRect(0, 0, width, height)
		let stream = canvas.captureStream()
		return Object.assign(stream.getVideoTracks()[0], { enabled: false })
	}

	handle_Video = () => this.setState({ video: !this.state.video }, () => this.getUserMedia())
	handle_Audio = () => this.setState({ audio: !this.state.audio }, () => this.getUserMedia())
	handle_Screen = () => this.setState({ screen: !this.state.screen }, () => this.getDislayMedia())

	end_Call = () => {
		try {
			let tracks = this.VideoRef.current.srcObject.getTracks()
			tracks.forEach(track => track.stop())
		} catch (e) {}
		window.location.href = "/home"
	}

	open_Chat = () => this.setState({ showModal: true })
	closeChat = () => this.setState({ showModal: false })
	handle_Message = (e) => this.setState({ message: e.target.value })

	addMessage = (data, sender, socket_idSender) => {
		this.setState(prevState => ({
			messages: [...prevState.messages, { "sender": sender, "data": data }],
		}))
		
	}

	

	send_Message = () => {
		socket.emit('chat-message', this.state.message, this.state.username)
		this.setState({ message: "", sender: this.state.username })
	}

	copy_Url = () => {
		let text = window.location.href
		if (!navigator.clipboard) {
			let textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				document.execCommand('copy')
				message.success("Link copied to clipboard!")
			} catch (err) {
				message.error("Failed to copy")
			}
			document.body.removeChild(textArea)
			return
		}
		navigator.clipboard.writeText(text).then(function () {
			message.success("Link copied to clipboard!")
		}, () => {
			message.error("Failed to copy")
		})
	}
	
	
    // to connect to other users
	video_connection = () => this.setState({ isConn: false }, () => this.getMedia());
	
	//to get username
	getuserkaname(){
			
			
			if(this.props.user.userData && this.props.user.userData.name){
				return this.props.user.userData.name;
			}else{
				return "";
			}
		}
		handleUsername = (e) =>{
			this.setState({ username: e.target.value })
		} 
	
	render() {
		
		
		return (
			<div>
			
			<div style={{flex:"12",textAlign: "center",backgroundColor:"#1b1a1a",height:"100vh"}}>
			{   this.state.isConn === true ?
					<div style={{position :"relative"}}>

						<div id="video_username" >
						<Input id="video_input" placeholder="Username" value={this.getuserkaname()} onChange={this.handleUsername} />
						<Button variant="contained" color="primary" onClick={this.video_connection} style={{ margin: "5px" }}>Start</Button>
						</div>

						<div id="user_video_div" >
							<video id="user_video" ref={this.VideoRef} autoPlay muted ></video>
						</div>

					</div>
					:
					<div style={{position: "relative"}}>
						<div className="btn-down" >
							<IconButton  onClick={this.handle_Video}>
								{(this.state.video === true) ? <VideocamIcon className="stylebutton" /> : <VideocamOffIcon className="stylebutton"/>}
							</IconButton>
							<IconButton  onClick={this.handle_Audio}>
								{this.state.audio === true ? <MicIcon className="stylebutton" /> : <MicOffIcon className="stylebutton"/>}
							</IconButton>

							{this.state.is_Screen_Available === true ?
								<IconButton  onClick={this.handle_Screen}>
									{this.state.screen === true ? < PresentToAllIcon className="stylebutton"/> : <CancelPresentationIcon className="stylebutton" />}
								</IconButton>
								: null}

						
								<IconButton  onClick={this.open_Chat}>
									<ChatIcon className="stylebutton"/>
								</IconButton>
							
							<IconButton className="end" onClick={this.end_Call}>
								<CallEndIcon className="stylebutton"/>
							</IconButton>
						</div>

						<Modal show={this.state.showModal} onHide={this.closeChat} >
							<Modal.Header closeButton>
								<Modal.Title>Meeting Chat</Modal.Title>
							</Modal.Header>
							<Modal.Body id="video_model" >
								{this.state.messages.length > 0 ? this.state.messages.map((item, index) => (
									<div key={index}>
										<p ><b>{item.sender}</b>   {item.data}</p>
									</div>
								)) : <p>No message yet</p>}
							</Modal.Body>
							<Modal.Footer className="div-send-msg">
								<Input placeholder="Message" value={this.state.message} onChange={e => this.handle_Message(e)} />
								<Button variant="contained" color="primary" onClick={this.send_Message}>Send</Button>
							</Modal.Footer>
						</Modal>

						<div className="container">
							<div style={{ paddingTop: "20px" }}>
								<Input style={{color:"white"}}value={window.location.href} disable="true"></Input>
								<Button id="video_clipboard" onClick={this.copy_Url}>Copy invite link</Button>
							</div>

							<Row id="users_container" className="flex-container" style={{ position:"relative",margin:"0"}}>
								<video id="user_video2" ref={this.VideoRef} autoPlay muted></video>
						
							</Row>
						</div>
					</div>
				}
			</div>
		  </div>
                
				
			
		)
	}
}



export default Video;







