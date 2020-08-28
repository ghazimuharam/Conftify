/* Initialize socket
and peer connection */
const socket = io('/')
const videoGrid = document.getElementById('videoGrid')
const peer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

/* create self 
video and mute */
const myVideo = createVideoElement()
myVideo.muted = true


const peers = {} //object to save connected user
const listConnection = {}
/* Join room in socket.io
when peer connection opened */
peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

/* Opening mediaDevices 
audio and video */
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream) //Render self video to html

  /* Event handler 
  for Peer call */
  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')

    /* this event called
    after call answered */
    call.on('stream', userVideoStream => {
      if(!peers[userId]){
        addVideoStream(video, userVideoStream)
      }
    })
  })
})

/* Socket conenction when user 
connected and disconnected */
socket.on('user-connected', userId => {
  connectToNewUser(userId)
})

socket.on('user-disconnected', userId => {
  if (peers[userId]){
    peers[userId].close()
  }
})

/**
 * 
 * This method called after new
 * user connected to the room
 * 
 * @param {uuid} userId 
 */
function connectToNewUser(userId) {
  const video = createVideoElement()
  navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
    const call = peer.call(userId, stream);

    call.on('stream', (remoteStream) => {
      if(!peers[userId]){
        peers[userId] = call
        addVideoStream(video, remoteStream)
      }
    })

    call.on('close', () => {
      video.remove()
    })
    
    }, (err) => {
      console.error('Failed to get local stream', err);
  })
}

/**
 * 
 * This method render video to html page
 * 
 * @param {Document} video HTML tag to nest user video
 * @param {object} stream video stream
 */
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(appendElemenToBody(video))
}

/**
 * create html video element
 */
function createVideoElement(){
    const video = document.createElement('video')
    return video
}

/**
 * This method create div for every 
 * video before rendering to html
 * 
 * @param {Document} video html video tag to render
 */
function appendElemenToBody(video){
    const div = document.createElement('div')
    div.className += "w-1/6 bg-teal-500 rounded-lg p-2 mx-2"
    div.appendChild(video)
    return(div)
}