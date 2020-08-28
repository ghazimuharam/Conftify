const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { validate:uuidValidate } = require('uuid');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs')
app.set('views', __dirname+'/views/');
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/room/generete', urlencodedParser, (req, res) => {
    res.send(uuidv4())
})

app.post('/room/join',urlencodedParser, (req, res) => {
    let validate = uuidValidate(req.body.roomSecret)
    if(true){
        res.redirect('/room/'+req.body.roomSecret)
    }
    res.send(validate)
})

app.get('/room/:roomId', (req, res) => {
    res.render('room', { roomId: req.params.roomId})
})

/**
 * Configuring socket.io connection
 */
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
  })

if(server.listen(3000,'0.0.0.0')){
    console.log('Listening on port 3000')
}