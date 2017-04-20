const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
// const history = require('connect-history-api-fallback')

const User = require('./routes/user')
const Events = require('./routes/events')

const app = express()
app.use(cors())
// app.use(history())

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use('/user', User)
app.use('/events', Events)

const port = 3000

app.listen(port, () => {
  console.log('server started at port: ' + port)
})
