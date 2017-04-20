const Sequelize = require('sequelize')
const db = require('../../config/database')

const Topic_1 = require('./topic_1')
const Topic_2 = require('./topic_2')

const Events = db.define('events', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  descript: Sequelize.STRING,
  topic1_id: {
    type: Sequelize.UUID
  },
  topic2_id: Sequelize.UUID,
  harm_level: Sequelize.STRING,
  occurrence_time: Sequelize.DATE,
  forensic_date: Sequelize.DATE
}, {
  freezeTableName: true,
  underscored: true
})

Events.belongsTo(Topic_2)
Topic_2.hasMany(Events)
Topic_2.belongsTo(Topic_1)
Topic_1.hasMany(Topic_2)

module.exports = Events

module.exports.addEvent = function (newEvent, cb) {
  const dbEvent = Events.build(newEvent)
  dbEvent.save().then((events) => {
    cb(null, events)
  }).catch((err) => {
    cb(err, null)
  })
}

module.exports.getTree = function (cb) {
  Topic_1.findAll({
    include: [
      {
        model: Topic_2,
        include: [
          {
            model: Events
          }
        ]
      }
    ]
  }).then((tree) => {
    const resObj = tree.map(topic1 => {
      return Object.assign(
        {},
        {
          topic1_id: topic1.id,
          name: topic1.name,
          descript: topic1.descript,
          harm_level: topic1.harm_level,
          children: topic1.topic2s.map(topic2 => {
            return Object.assign(
              {},
              {
                topic2_id: topic2.id,
                name: topic2.name,
                descript: topic2.descript,
                harm_level: topic2.harm_level,
                children: topic2.events.map(event => {
                  return Object.assign(
                    {},
                    {
                      event_id: event.id,
                      name: event.name,
                      descript: event.descript,
                      harm_level: event.harm_level,
                      occurrence_time: event.occurrence_time,
                      forensic_date: event.forensic_date
                    }
                  )
                })
              }
            )
          })
        }
      )
    })
    cb(false, resObj)
  }).catch((err) => {
    cb(err, null)
  })
}

module.exports.updateEvent = function(body, cb) {
  Events.update(
    {
      name: body.name,
      descript: body.descript,
      harm_level: body.harm_level
    },
    {
      where: {
        id: body.id
      }
    }
  ).then((events) => {
    cb(null, events)
  }).catch((err) => {
    cb(err, false)
  })
}
