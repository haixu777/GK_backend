const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const history = require('connect-history-api-fallback')
const Soap = require('soap')

const User = require('./routes/user')
const Events = require('./routes/events')
const Control = require('./routes/control')
const Sample = require('./routes/sample')
const Group = require('./routes/group')
const Keywords = require('./routes/keywords')

const app = express()


// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.disable('x-powered-by')

app.use(cors())
app.use(history())

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

var client = null
var wsdl_url = 'http://10.136.162.26:8080/AuthProxy/webservice/ServiceAuth?wsdl'
var ticket = null
Soap.createClient(wsdl_url, (err, _client) => {
  if (err) {
    throw err
  }
  client = _client
})

app.post('/login', urlencodedParser, (req, res, next) => {
  // res.send(req.body)
  ticket = req.body.ticket
  client.nsc_parseTicket({ ticket: ticket, signValue: 'signValue', clientIP: '127.0.0.1' }, (err, result) => {
    if (err) {
      throw err
      return res.send(err)
    }
    res.json({msg: result})
  })
})

/*
app.post('/logout', (req, res, next) => {
  res.clearCookie('realName')
  res.redirect('http://10.136.88.98')
})
*/

app.use('/user', User)
app.use('/sample', Sample)
app.use('/events', Events)
app.use('/control', Control)
app.use('/group', Group)
app.use('/keywords', Keywords)

const port = 3000

app.listen(port, () => {
  console.log('server started at port: ' + port)
})
