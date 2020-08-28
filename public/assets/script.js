const socket = io('/')
const videoGrid = document.getElementById('videoGrid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = createVideoElement()
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = createVideoElement()
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const video = createVideoElement()
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
        const call = myPeer.call(userId, stream);
        call.on('stream', (remoteStream) => {
            addVideoStream(video, remoteStream)
        });
        call.on('close', () => {
            video.remove()
        })
        peers[userId] = call
      }, (err) => {
        console.error('Failed to get local stream', err);
    })
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(appendElemenToBody(video))
}

function createVideoElement(){
    const video = document.createElement('video')
    return video
}

function appendElemenToBody(video){
    console.log('masuk')
    const div = document.createElement('div')
    div.className += "w-1/6 bg-teal-500 rounded-lg p-2 mx-2"
    div.appendChild(video)
    return(div)
}