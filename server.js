const express = require('express')
const app = express()
const server = require('http').createServer(app)
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const router = require("./routes/index.js")
const timer = require("./config/time.js")
const path = require('path')
const mongoose = require('mongoose')
const socketIO = require('socket.io')
const io = socketIO(server, {
  cors: {
      origin: "*"
  }
});
const { readPartFile, readMachineFile, readTimerFile, readJobFile } = require('./convertdb/index.js')
const { socketMiddleware } = require('./middleware/socket.js')

dotenv.config({path: __dirname + '/.env'});

const port = process.env.PORT || 8000
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log(err))

timer.startTimer()

app.use(socketMiddleware(io))
app.use(express.static(path.join(__dirname, 'client')));
app.use(cors({ credentials: true, origin: "*" }))
app.use(cookieParser())
app.use(express.json())
app.use(router)

// readPartFile()
// readMachineFile()
// readTimerFile()
// readJobFile()

server.listen(port, () => { console.log(`server running at port ${port}`) })