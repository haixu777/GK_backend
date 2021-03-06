const Sequelize = require('sequelize')
const db = require('../../config/database')
const rp = require('request-promise')

const $utils = require('../../utils')

const Events = db.define('events', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  descript: Sequelize.STRING,
  parent_id: {
    type: Sequelize.UUID,
    hierarchy: true
  },
  harm_level: Sequelize.STRING,
  level: Sequelize.STRING,
  type: Sequelize.STRING,
  occurrence_time: Sequelize.DATE,
  control_start_time: Sequelize.DATE,
  control_end_time: Sequelize.DATE,
  edit_time: Sequelize.DATE,
  recurrence: Sequelize.STRING,
  category: Sequelize.INTEGER,
  remark: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

Events.isHierarchy()

// Events.hasMany(Events)
// Events.belongsTo(Events)

module.exports = Events

/*
module.exports.addEvent = function (newEvent, cb) {
  const dbEvent = Events.build(newEvent)
  dbEvent.save().then((events) => {
    cb(null, events)
  }).catch((err) => {
    cb(err, null)
  })
}
*/

module.exports.addEvent = function (newEvent, cb) {
  if(newEvent.id === ''){
    const dbEvent = Events.build({
      name: newEvent.name,
      descript: newEvent.descript,
      level: newEvent.level,
      type: Number(newEvent.type),
      parent_id: newEvent.parent_id,
      harm_level: newEvent.harm_level,
      occurrence_time: newEvent.occurrence_time,
      edit_time: newEvent.edit_time,
      recurrence: newEvent.recurrence,
      control_start_time: newEvent.alertRange ? newEvent.alertRange[0] : null,
      control_end_time: newEvent.alertRange ? newEvent.alertRange[1] : null,
      category: newEvent.category,
      remark: newEvent.remark
    })
    dbEvent.save().then((ins) => {
      //cb(null, events)
      Events.findOne({
	where: {
	  name: newEvent.name,
          descript: newEvent.descript,
	  edit_time: newEvent.edit_time
	}
      }).then((now_event) => {
        cb(null, null)
        /* 与神通库同步的接口，需要可以打开
        	rp({
        	  method: 'POST',
        	  uri: 'http://10.136.88.96:8080/api/events_sync/add.do',
        	  json: true,
        	  body: {
        	    ID: now_event.id,
                    NAME: now_event.name,
                    DESCRIPT: now_event.descript,
                    HARM_LEVEL: now_event.harm_level,
                    CONTROL_START_TIME: now_event.control_start_time || null
        	  }
        	}).then((res) => {
        	  console.log(res)
        	  cb(null, null)
        	})
       */
      })
    }).catch((err) => {
      cb(err, null)
    })
  } else {
    let parent_id = newEvent.parent_id
    if (newEvent.parent_id === 0 || newEvent.parent_id === '' || newEvent.parent_id === undefined) {
      parent_id = null
    }
    Events.update(
    {
      name: newEvent.name,
      descript: newEvent.descript,
      level: newEvent.level,
      type: newEvent.type,
      parent_id: parent_id,
      occurrence_time: newEvent.occurrence_time,
      edit_time: newEvent.edit_time,
      recurrence: newEvent.recurrence,
      harm_level: newEvent.harm_level,
      control_start_time: newEvent.alertRange ? newEvent.alertRange[0] : null,
      control_end_time: newEvent.alertRange ? newEvent.alertRange[1] : null,
      category: newEvent.category,
      remark: newEvent.remark
    },
    {
      where: {
        id: newEvent.id
      }
    }
  ).then((events) => {
    cb(null, null)
    /* 与神通库同步的接口，需要可以打开
    rp({
      method: 'POST',
      uri: 'http://10.136.88.96:8080/api/events_sync/updateById.do',
      json: true,
      body: {
	ID: newEvent.id,
	NAME: newEvent.name,
	DESCRIPT: newEvent.descript,
	HARM_LEVEL: (newEvent.harm_level).toString(),
	CONTROL_START_TIME: newEvent.alertRange ? newEvent.alertRange[0] : null
      }
    }).then((res) => {
	console.log(res)
	cb(null, null)
    })
    */
  }).catch((err) => {
    cb(err, false)
  })
  }
}

module.exports.getTree = function (cb) {
  Events.findAll({
    hierarchy: true
  }).then((tree) => {
    const resObj = tree.map(topic1 => {
      return Object.assign(
        {},
        {
          id: topic1.id,
          name: topic1.name,
          parent_id: topic1.parent_id,
          descript: topic1.descript,
          occurrence_time: topic1.occurrence_time,
          edit_time: topic1.edit_time,
          level: topic1.level,
          type: Number(topic1.type),
          harm_level: Number(topic1.harm_level),
          disabled: topic1.type === 1,
          recurrence: Number(topic1.recurrence),
          alertRange: [topic1.control_start_time, topic1.control_end_time],
          category: topic1.category,
          remark: topic1.remark,
          children: topic1.children ? topic1.children.map(topic2 => {
            return Object.assign(
              {},
              {
                id: topic2.id,
                name: topic2.name,
                parent_id: topic2.parent_id,
                descript: topic2.descript,
                occurrence_time: topic2.occurrence_time,
                edit_time: topic2.edit_time,
                level: topic2.level,
                type: Number(topic2.type),
                harm_level: Number(topic2.harm_level),
                disabled: topic2.type === 1,
                recurrence: Number(topic2.recurrence),
                alertRange: [topic2.control_start_time, topic2.control_end_time],
                category: topic2.category,
                remark: topic2.remark,
                children: topic2.children ? topic2.children.map(events => {
                  return Object.assign(
                    {},
                    {
                      id: events.id,
                      name: events.name,
                      parent_id: events.parent_id,
                      descript: events.descript,
                      occurrence_time: events.occurrence_time,
                      edit_time: events.edit_time,
                      level: events.level,
                      type: Number(events.type),
                      harm_level: Number(events.harm_level),
                      disabled: events.type === 1,
                      recurrence: Number(events.recurrence),
                      category: events.category,
                      remark: events.remark,
                      alertRange: [events.control_start_time, events.control_end_time]
                    }
                  )
                }) : []
              }
            )
          }) : []
        }
      )
    })
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
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

module.exports.delEvents = function(id, cb) {
  Events.findById(id)
    .then((_event) => {
      if (!_event) {
        cb(null, null)
      }
      console.log(_event)
      _event.destroy().then(() => {
        cb(null, '事件：' + _event.name + ', 删除成功!')
        /* 与神通库同步的接口，需要可以打开
	rp({
	  method: 'POST',
	  uri: 'http://10.136.88.96:8080/api/events_sync/delById.do',
	  json: true,
	  body: {
	    ID: id
	  }
	}).then((res) => {
	  console.log(res)
	  cb(null, '事件：' + _event.name + ',删除成功!')
	})
        */
      }).catch((err) => {
        cb(err, false)
      })
    }).catch((err) => {
      cb(err, false)
    })
}

module.exports.getEventList = function(month, cb) {
  let toDou_month = month < 10 ? ('0' + month) : month
  Events.findAll({
    attributes: [
      'id', 'name', 'descript', 'parent_id', 'harm_level', 'level', 'occurrence_time', 'edit_time', 'remark',
      [Sequelize.fn('date_format', Sequelize.col('occurrence_time'), '%m'), 'month']
    ],
    where: {
      type: 1
    }
  }).then((eventList) => {
    const arr = []
    eventList.forEach((item) => {
      if (item.get('month') === toDou_month) {
        arr.push({
          id: item.id,
          name: item.name,
          descript: item.descript,
          parent_id: item.parent_id,
          harm_level: item.harm_level,
          level: item.level,
          date: (item.occurrence_time).getDate(),
          occurrence_time: item.occurrence_time.toLocaleString(),
          edit_time: item.edit_time,
          remark: item.remark
        })
      }
    })
    /*
    const resObj = eventList.map(item => {
      return Object.assign(
        {},
        {
          id: item.id,
          name: item.name,
          descript: item.descript,
          parent_id: item.parent_id,
          harm_level: item.harm_level,
          level: item.level,
          date: (item.occurrence_time).getDate(),
          occurrence_time: item.occurrence_time.toLocaleString(),
          edit_time: item.edit_time
        }
      )
    })
    */
    cb(null, arr)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getEventByMonth = function(queryObj, cb) {
  let recurrence = {category: 1}
  if (queryObj.recurrence) {
    recurrence.recurrence = 1
  }
  recurrence.category = 1
  console.log(recurrence);
  Events.findAll({
    attributes: [
      'id', 'name', 'occurrence_time', 'descript', 'control_start_time', 'control_end_time', 'remark', 'harm_level',
      [Sequelize.fn('date_format', Sequelize.col('occurrence_time'), '%m'), 'month']
    ],
    where: recurrence
  }).then((eventsList) => {
    const resObj = eventsList.map(events => {
      return Object.assign(
        {},
        {
          id: events.id,
          title: events.name,
          start: queryObj.view ? ($utils.formatCalendarDate(events.control_start_time)) : ($utils.formatCalendarDate(events.occurrence_time)),
          end: queryObj.view ? $utils.formatCalendarDate(events.control_end_time) : '',
          month: events.get('month'),
          cssClass: $utils.handleHarmlevel2Color(events.harm_level),
          descript: events.descript,
          remark: events.remark
        }
      )
    })
    return cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getEventByDay = function(reqObj, cb) {
  Events.findAll({
    where: Sequelize.and(
      Sequelize.where(Sequelize.fn('Day', Sequelize.col('occurrence_time')), reqObj.day),
      Sequelize.where(Sequelize.fn('Month', Sequelize.col('occurrence_time')), reqObj.month)
    )
  }).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getNotice = function(now, cb) {
  let earlyDay = new Date(now.getTime() - (86400000 * 4))
  let laterDay = new Date(now.getTime() + (86400000 * 4))
  Events.findAll({
    where: {
      control_start_time: { lte: laterDay },
      control_end_time: { gte: earlyDay },
      category: 1
    }
  }).then((noticeList) => {
    cb(null, noticeList)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.fetchEventListForControl = function(cb) {
  Events.findAll({
    where: {
    },
    attributes: ['id', 'name']
  }).then((eventList) => {
    const resObj = eventList.map((item) => {
      return Object.assign(
        {},
        {
          value: item.id,
          text: item.name
        }
      )
    })
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}
