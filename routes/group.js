const express = require('express')
const Router = express.Router()

const Group = require('../models/group')

Router.get('/fetchPerson', (req, res, next) => {
  Group.fetchPerson(req.query.groupId, (err, result) => {
    res.json({
      success: true,
      name: result.name,
      personList: result.personList
    })
  })
})

module.exports = Router
