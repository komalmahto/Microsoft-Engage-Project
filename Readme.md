## As part of Microsoft Engage'21 Mentorship Program , I made Microsoft Teams Clone by using Agile Methodology.

| Project | Link |
| ------ | ------ |
| Website |  https://komalmahto-microsoft-teams.herokuapp.com/
| Presenatation | https://drive.google.com/drive/folders/17VbJrliH9hGqH6gOmFkcinkwM71C__BN?usp=sharing
| Video Demo | https://drive.google.com/drive/folders/1Bv9xIOe9Vp9eDQhTgyY_OZA4SGo_aJuP?usp=sharing

---
## Features
- User Authentication
- Flash messages for incorrect email, password during login
- Flash messages for not password matching , password length less than 6 and not filling the required details during Signup
- Can't acces chat, meet, note and home section without authentication
- Video call with friends 
- More than two users are able to connect.
- Add custom name to join the call
- Add custom name to create meeting url
- Chat during the call and and continue after meeting
- Invite more users
- Present screen
- Switch audio on/off
- Switch video on/off
- Chat with friends 
- Store chats
- Send images and videos
- Speech to text 
- Don't wanna write , speak and send the message.
- Download video
- Picture in picture mode 
- Full screen video
- Make customised notes
- Save notes
- delete notes 
- Username avatar
- Profile details on clicking profile picture.
- Secured Password

---
## Technology

- React - building user interface
- Express - fast node.js network app framework 
- Redux - State management
- MongoDB - Database
- Bcrypt - hashing every password with a salt
- Socket.io - real-time, bidirectional and event-based communication
- WebRTC - audio and/or video media, as well as to exchange data
- SpeechRecognition - text to speech
- Multer - uploading files
- Cloudinary - uploading files(Heroku does not store your data)
- JWT - authorization using sessions
- Cookie-parser - parse cookies attached to the client request object
---

## Installation
It requires [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) to run.


## Frontend
- replace the server url https://komalmahto-microsoft-teams.herokuapp.com/ with http://localhost:5000/
- proxy under package.json to http://localhost:5000/
```javascript
cd client
npm i
npm start
```
## Backend
- make dev.js file inside config folder
- put mongoDB url into dev.js file
```javascript
npm i
cd server
nodemon index.js
```
Open browser and goto http://localhost:3000/

---

# Screenshorts
#### Login Page
---
<img src="/Screenshorts/1.png">

#### Signup Page
---
<img src="/Screenshorts/2.png">

#### Home Page
---
<img src="/Screenshorts/3.png">

#### Chat Page 
---
<img src="/Screenshorts/4(1).png">
#####
<img src="/Screenshorts/5(1).png">
#####
<img src="/Screenshorts/6(1).png">
#####
<img src="/Screenshorts/6(2).png">

#### Video Meet
---
<img src="/Screenshorts/7.png">
#####
<img src="/Screenshorts/8.png">
#####
<img src="/Screenshorts/9.png">
#####
<img src="/Screenshorts/10.png">

#### Notes
---
<img src="/Screenshorts/12.png">
#####
<img src="/Screenshorts/13.png">

#### Logout 
---
<img src="/Screenshorts/14.png">