import React, { Component } from 'react';
import io from "socket.io-client";
import { connect } from "react-redux";
import { getChats, afterPostMessage } from "../../../Actions/chat_actions";
import Axios from 'axios';
import ImageIcon from '@material-ui/icons/Image';
import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
import MicIcon from '@material-ui/icons/Mic';
import { FormControl } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ChatCard from "./Sections/chatDiv"
import Dropzone from 'react-dropzone';
import Upperbar from './Navbar';
import NavBar from '../SideBar/SideBar';
import "./Chatting.css";
import MicOffIcon from '@material-ui/icons/MicOff';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'


export class ChatPage extends Component {
    state = {
        chatMessage: "",
        incomming:"",
        isIncomming:false,
        isListening:true
    }

    componentDidMount() {
        let server = "https://komalmahto-microsoft-teams.herokuapp.com";

        this.props.dispatch(getChats());

        this.socket = io(server);

        this.socket.on("back-message", messageFromBackEnd => {
            this.props.dispatch(afterPostMessage(messageFromBackEnd));
        })
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    hanleSearchChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }
 
    renderCards = () =>
        this.props.chats.chats
        && this.props.chats.chats.map((chat) => (
           <ChatCard key={chat._id}  {...chat}  />
        ));

    onDrop = (files) => {
      
        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let formData = new FormData();
       
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])
        

        formData.append("upload_preset","tgkyyzcb") ;

       Axios.post("https://api.cloudinary.com/v1_1/digvkvltj/upload",formData).then((response)=>{
         let currentDate = new Date();
         let mytime = currentDate.getHours() + ":" + currentDate.getMinutes() ;
         let time = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "," + " " + mytime;
         let chatMessage = response.data.secure_url
         let userId = this.props.user.userData._id
         let userName = this.props.user.userData.name;
         let userImage = `${this.props.user.userData.image}&background=random`;
         let nowTime = time;
         let type = "Text"
 
         this.socket.emit("new-message", {
             chatMessage,
             userId,
             userName,
             userImage,
             nowTime,
             type
         });
         this.setState({ chatMessage: "" })
       
       })

       
    };
   
    
    

    submitChatMessage = (e) => {
        e.preventDefault();
        
        
        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }
        let currentDate = new Date();
        let mytime = currentDate.getHours() + ":" + currentDate.getMinutes() ;
        let time = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "," + " " + mytime;
        let chatMessage = this.state.chatMessage
        let userId = this.props.user.userData._id
        let userName = this.props.user.userData.name;
        let userImage = `${this.props.user.userData.image}&background=random`;
        let nowTime = time;
        let type = "Text"

        this.socket.emit("new-message", {
            chatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type
        });
        this.setState({ chatMessage: "" })
    }
    handleListen = () => {
        if (this.state.isListening) {
          mic.start()
          mic.onend = () => {
            mic.start()
          }
        } else {
          mic.stop()
          mic.onend = () => {
          }
        }
        mic.onstart = () => {
        }
    
        mic.onresult = event => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
          this.setState({chatMessage:transcript});
          mic.onerror = event => {
          }
        }
      }
    handlemic(){
        
        
        if(this)
        {
            const val=!this.state.isListening;
            this.setState({isListening:val});
            this.handleListen();
        } 
    }
    render() {
        return (
            <>
                <Upperbar/>
                <div style={{display:'flex',backgroundColor:"#f5f5f5"}}>
                <div style={{flex:'1'}} id="navlow">
                    <NavBar/>
                    </div>
                
                <div style={{ flex:'11',right:'0',width:'94%' }}>
                    <div style={{  height: '85vh',width:'100%',overflowX:'scroll', overflowY: 'scroll' }}>
                        <div  >
                        {this.props.chats && (
                            this.renderCards()
                        )}
                        </div>
                        <div
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                           
                        />
                    </div>
                    <FormControl style={{position:"fixed",bottom:"0",width:"100%"}} onSubmit={this.submitChatMessage}>
                  <div style={{overflowX:'scroll',display:'flex',width:'100%'}}>       
                                <Input
                                    id="message"
                                    style={{width:'70%',margin:'0.5% 1%',borderBottomStyle:'solid'}}
                                    prefix={<ChatIcon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Start a new conversation."
                                    type="text"
                                    value={this.state.chatMessage}
                                    onChange={this.hanleSearchChange}
                                />
                           
                                <Dropzone onDrop={this.onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <button className="button_image" style={{margin: '10px 2px',border:'none',backgroundColor:"#f5f5f5"}} >
                                                    <ImageIcon type="upload" />
                                                </button>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                                <button  className="button_image" style={{margin: '2px',border:'none',backgroundColor:"#f5f5f5"}}  onClick={this.handlemic.bind(this)} >
                                {!this.state.isListening ? <MicIcon type="enter" />:<MicOffIcon type="enter" />}
                                </button>
                                <button className="button_image" style={{margin: '2px',border:'none',backgroundColor:"#f5f5f5"}}   onClick={this.submitChatMessage} htmlType="submit">
                                    <SendIcon type="enter" />
                                </button>
                          </div> 
                        </FormControl>

                </div>
               </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chats: state.chat
    }
}


export default connect(mapStateToProps)(ChatPage);
