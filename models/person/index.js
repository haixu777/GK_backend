const Sequelize = require('sequelize')
const db = require('../../config/database')

const Events = require('../events')
const Event2person = require('./event2person')

const Persons = db.define('persons', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  birthdate: Sequelize.STRING,
  gender: Sequelize.STRING,
  nativeplace: Sequelize.STRING,
  residence: Sequelize.STRING,
  occupation: Sequelize.STRING,
  attention: Sequelize.STRING,
  tendency: Sequelize.STRING,
  influence: Sequelize.STRING,
  faith: Sequelize.STRING,
  education: Sequelize.STRING,
  comment: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
})

Events.belongsToMany(Persons, {through: Event2person, as: 'Persons'})
// Events.belongsToMany(Persons, {through: 'event2person', as: 'Person'})
Persons.belongsToMany(Events, {through: Event2person})

module.exports = Persons

module.exports.fetchByEventId = function(eventID, cb) {
  Events.findOne({
    where: {
      id: eventID
    },
    required: true
  }).then((events) => {
    let trigger = false
    for (let prop in events) {
      if (prop === 'getPersons') {
        trigger = true
      }
    }

    if (trigger) {
      events.getPersons().then((personList) => {
        let resObj = personList.map((person) => {
          return Object.assign(
            {},
            {
              id: person.id,
              name: person.name,
              birthdate: person.birthdate,
              gender: person.gender,
              nativeplace: person.nativeplace,
              residence: person.residence,
              occupation: person.occupation,
              attention: person.attention,
              tendency: person.tendency,
              influence: person.influence,
              faith: person.faith,
              education: person.education,
              comment: person.comment
            }
          )
        })
        cb(null, resObj)
      })
    } else {
      cb(null, [])
    }

  }).catch((err) => {
    cb(err, false)
  })
}
