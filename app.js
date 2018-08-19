const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const history = require('connect-history-api-fallback')
// const Soap = require('soap')

const User = require('./routes/user')
const Events = require('./routes/events')
const Control = require('./routes/control')
const Sample = require('./routes/sample')
const Group = require('./routes/group')
const Keywords = require('./routes/keywords')
const handleAccount = require('./routes/handleAccount')
const User_wxb = require('./routes/user_wxb')
const Taizhang = require('./routes/taizhang')
const Total = require('./routes/total')

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

app.post('/login', urlencodedParser, (req, res, next) => {
  let ticket = req.body.ticket
  // 8hours
  //res.cookie('ticket', ticket, { expires: new Date(Date.now() + 8*60*60*1000), httpOnly: false })
  res.cookie('ticket', escape(ticket), { expires: new Date(Date.now() + 8*60*60*1000) })
  res.redirect('http://10.136.88.96:3333/home')
})

/*
var client = null
var userInfo_client = null
var wsdl_url = 'http://10.136.162.26:8080/AuthProxy/webservice/ServiceAuth?wsdl'
var userInfo_wsdl_url = 'http://10.136.162.26:8080/WebServices/services/baseResInfo?wsdl'
var ticket = null
var menhu_userAccount = null
var menhu_signValue = null
var menhu_userId = null

Soap.createClient(wsdl_url, (err, _client) => {
  if (err) {
    throw err
  }
  client = _client
})

Soap.createClient(userInfo_wsdl_url, (err, _client) => {
  if (err) {
    throw err
  }
  userInfo_client = _client
})

app.post('/login', urlencodedParser, (req, res, next) => {
  ticket = req.body.ticket
  console.log('ticket: '+ ticket)
  client.ncs_parseTicket({ ticket: ticket, signValue: 'signValue', clientIP: '127.0.0.1' }, (err, result) => {
    if (err) {
      throw err
      return res.send(err)
    }
    var jsonRes = JSON.parse(result.out)
    result.out = jsonRes
    //res.json(result)
    menhu_userAccount = result.out.content.userAccount
    console.log('userAccount: ' + menhu_userAccount)
    menhu_signValue = result.out.content.signValue
    menhu_userId = result.out.content.userId
    res.cookie('realName', unescape(result.out.content.realName), { expires: new Date(Date.now() + 7*24*60*60*1000), httpOnly: false })
    res.cookie('isAdmin', true, { expires: new Date(Date.now() + 7*24*60*60*1000), httpOnly: false })
    res.redirect('http://10.136.88.96:3333/home')
  })
})
*/

/*
app.get('/menhuGroupData', (req, res, next) => {
  console.log('userAccount: ' + menhu_userAccount)
  userInfo_client.getUserInfoByAccount({ accountName: menhu_userAccount, ticket: ticket, signValue: menhu_signValue }, (err, result) => {
    if (err) {
      throw err
      return res.send(err)
    }
    res.json({msg: result})
  })
})
*/


/*
app.post('/logout', (req, res, next) => {
  res.clearCookie('realName')
  //res.redirect('http://10.136.88.98')
  res.json({ logout: true })
})
*/


app.use('/user', User)
app.use('/sample', Sample)
app.use('/events', Events)
app.use('/control', Control)
app.use('/group', Group)
app.use('/keywords', Keywords)
app.use('/handleAccount', handleAccount)
app.use('/user_wxb', User_wxb)
app.use('/taizhang', Taizhang)
app.use('/total', Total)

const port = 3333

app.listen(port, () => {
  console.log('server started at port: ' + port)
})
