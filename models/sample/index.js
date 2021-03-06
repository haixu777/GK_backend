const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')
const autoSample = require('./auto_results')

const Events = require('../events')
const User = require('../user')

const Sample = db.define('samples', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  forensic_date: Sequelize.DATE,
  post: Sequelize.STRING,
  url: Sequelize.STRING,
  publish_platform: Sequelize.STRING,
  publish_chanel: Sequelize.STRING,
  publish_time: Sequelize.DATE,
  publish_account: Sequelize.STRING,
  sample_title: Sequelize.STRING,
  sample_content: Sequelize.STRING,
  sample_path: Sequelize.STRING,
  sample_format: Sequelize.STRING,
  event_id: Sequelize.UUID,
  operator: Sequelize.STRING,
  keyword: Sequelize.STRING,
  user_id: Sequelize.INTEGER,
  update_time: Sequelize.TIME
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

Sample.belongsTo(Events)
Sample.belongsTo(User)

module.exports = Sample

module.exports.getSampleByEvent = function(eventId, cb) {
  Sample.findAll({
    where: {
      event_id: eventId
    }
  }).then((sampleList) => {
    cb(null, sampleList)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getList = function(reqObj, cb) {
  console.log(reqObj)
  reqObj.currentPage--
  Sample.findAndCountAll({
    limit: reqObj.perItem,
    offset: reqObj.currentPage * reqObj.perItem,
    where: {
      event_id: reqObj.eventId ? reqObj.eventId : { $ne: null },
      sample_format: (!reqObj.sample_format) ? ({ $not: true }) : reqObj.sample_format,
      // hasKeyword: 0,1,-1
      // 0: 未配置, 1: 未配置, -1: 所有
      // keyword: (reqObj.hasKeyword === '') ? ({ $not: true }) : (Number(reqObj.hasKeyword) ? { $ne: '' } : ''),
      // user_id: (!reqObj.user_id) ? ({ $not: false }) : reqObj.user_id,
      forensic_date: reqObj.time_start ? { lte: reqObj.time_end, gte: reqObj.time_start } : { $ne: null },
      // sample_content: (reqObj.hasContent === '') ? ({ $not: null }) : (Number(reqObj.hasContent) ? { $ne: null } : null),
      publish_platform: (reqObj.hasPlatform === '') ? ({ $not: true }) : (Number(reqObj.hasPlatform) ? { $ne: null  } : null)
    },
    include: [
      {
        model: Events,
        attributes: ['name'],
        required: false
      }
      /*
      {
        model: User,
        attributes: ['name']
      }
      */
    ],
    order: reqObj.sort_key + ' ' + reqObj.sort_order
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        sampleList: res.rows.map((sample) => {
          let eventName = ''
          if (!sample.event) {
            eventName = '未分类事件集合'
          } else {
            eventName = sample.event.name
          }
          return Object.assign(
            {},
            {
              forensic_date: $utils.formatTime(sample.forensic_date),
              id: sample.id,
              post: sample.post,
              publish_account: sample.publish_account,
              publish_chanel: sample.publish_chanel,
              publish_platform: sample.publish_platform,
              publish_time: sample.publish_time,
              sample_content: sample.sample_content,
              sample_format: sample.sample_format,
              sample_path: sample.sample_path,
              sample_title: sample.sample_title,
              keyword: sample.keyword,
              url: sample.url,
              event_name: eventName,
              event_id: sample.event_id,
              operator: sample.operator,
              update_time: $utils.formatTime(sample.update_time),
            }
          )
        }),
        totalItem: res.count
      }
    )
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.updateSample = function(reqObj, cb) {
  Sample.update(
    {
      event_id: reqObj.event_id,
      forensic_date: reqObj.forensic_date,
      post: reqObj.post,
      publish_account: reqObj.publish_account,
      publish_chanel: reqObj.publish_chanel,
      publish_platform: reqObj.publish_platform,
      publish_time: reqObj.publish_time,
      sample_content: reqObj.sample_content,
      sample_format: reqObj.sample_format,
      sample_path: reqObj.sample_path,
      sample_title: reqObj.sample_title,
      keyword: (reqObj.keyword) ? ((reqObj.keyword).replace(/\s+/g, ' ').trim()) : '',
      url: reqObj.url,
      operator: reqObj.operator
    },
    {
      where: {
        id: reqObj.id
      }
    }
  ).then(() => {
    cb(null, ('update sample success! id: ' + reqObj.id))
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.del = function(sample_id, cb) {
  Sample.destroy({
    where: {
      id: sample_id
    }
  }).then(() => {
    cb(null, '删除成功!')
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.extra = function(reqObj, cb) {
  autoSample.findById(reqObj.sampleId)
    .then((_autoSample) => {
      let db_sample = Sample.build({
        forensic_date: _autoSample.forensic_date,
        post: reqObj.post,
        url: reqObj.url,
        publish_platform: reqObj.publish_platform || null,
        publish_chanel: reqObj.publish_chanel,
        publish_time: reqObj.publish_time,
        publish_account: reqObj.publish_account,
        forensic_date: reqObj.forensic_date,
        sample_title: _autoSample.name,
        sample_content: reqObj.sample_content,
        sample_path: _autoSample.path,
        sample_format: reqObj.sample_format,
        event_id: reqObj.event_id,
        keyword: (reqObj.keyword) ? ((reqObj.keyword).replace(/\s+/g, ' ').trim()) : '',
        operator: reqObj.operator
      })
      db_sample.save().then(() => {
        _autoSample.destroy().then(() => {
          cb(null, `样本: ${reqObj.sample_title}, 抽取成功！`)
        }).catch((err) => {
          cb(err, false)
        })
      }).catch((err) => {
        cb(err, false)
      })
    }).catch((err) => {
      cb(err, false)
    })
}

module.exports.fetchAccountByEventId = function(id, cb) {
  Sample.findAll({
    attributes: ['publish_account'],
    where: {
      event_id: id
    },
    group: ['publish_account']
  }).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.fetchKeywordByEventId = function(id, cb) {
  Sample.findAll({
    attributes: ['keyword'],
    where: {
      event_id: id
    },
    group: ['keyword']
  }).then((res) => {
    var resObj = []
    for (var i=0; i<res.length; i++) {
      //console.log(res[i]['keyword'])
      if (res[i]['keyword']) {
        resObj.push({label: res[i]['keyword']})
      }
    }
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}
