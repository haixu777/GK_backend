const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
// const history = require('connect-history-api-fallback')

const User = require('./routes/user')
const Events = require('./routes/events')
const Control = require('./routes/control')
const Sample = require('./routes/sample')
const Group = require('./routes/group')

const app = express()

app.disable('x-powered-by')

app.use(cors())
// app.use(history())

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use('/user', User)
app.use('/sample', Sample)
app.use('/events', Events)
app.use('/control', Control)
app.use('/group', Group)

const port = 3000

app.listen(port, () => {
  console.log('server started at port: ' + port)
})
