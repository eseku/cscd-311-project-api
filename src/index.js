const express = require('express'), chalk = require('chalk'), student = require('./routers/student')
const port = process.env.port || 3000, hotel = require('./routers/hostel'), cors = require('cors')

const server = express()
server.use(cors(), express.json(), express.urlencoded({extended: true}), hotel, student)

server.get('/home', (req, res) => {
  res.send('hello')
})

server.listen(port, () => {
  console.log(chalk.green(port))
})
