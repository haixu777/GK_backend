const db = require('../../config/database')
const $utils = require('../../utils')

let query = {
  keyword: 'select count(distinct keyword) as num from samples where keyword != "" and (forensic_date between :time_start and :time_end)',
  sample: 'select count(*) as num from samples where (forensic_date between :time_start and :time_end)',
  account: 'select count(distinct publish_account) as num from samples where publish_account != "" and (forensic_date between :time_start and :time_end)',
  person: 'select count(distinct name) as num from persons',
  website: 'select count(distinct publish_platform) as num from samples where publish_platform != "" and (forensic_date between :time_start and :time_end)',
  group: 'select count(distinct name) as num from `group`',
  events: 'select count(*) as num from events where type = 1 and (occurrence_time between :time_start and :time_end)',
  anli: 'select count(*) as num from events where type = 1 and (occurrence_time between :time_start and :time_end)',
  taizhang: 'select count(*) as num from taizhang where (time between :time_start and :time_end)',
  control: 'select count(*) as num from `control_programs` where (control_time between :time_start and :time_end)'
}

let queryWithEventId = {
  keyword: ' and event_id = :event_id',
  sample: ' and event_id = :event_id',
  account: ' and event_id = :event_id',
  person: '',
  website: ' and event_id = :event_id',
  group: '',
  events: ' and id = :event_id',
  anli: ' and id = :event_id',
  taizhang: ' and event_id = :event_id',
  control: ' and event_id = :event_id'
}

module.exports.getAll = function(reqObj, cb) {
  let sql = ''
  if (!reqObj.eventId) {
    sql = query[reqObj.key]
  } else {
    sql = query[reqObj.key] + queryWithEventId[reqObj.key]
  }
  db.query(sql, {
    replacements: {
      event_id: reqObj.eventId || 104,
      time_start: reqObj.time_start || '1900-12-21',
      time_end: reqObj.time_end || '2100-12-21'
    }
  }).then((rows) => {
    let str = JSON.stringify(rows)
    let num = JSON.parse(str)
    cb(null, num[0][0].num)
  }).catch((err) => {
    cb(err, false)
  })
}


let itemQuery = {
  keyword: 'select distinct a.keyword, b.name from samples a left join events b on a.event_id = b.id where a.keyword != "" and (a.forensic_date between :time_start and :time_end)',
  sample: 'select a.sample_title, a.sample_content, a.sample_format,  b.name from samples a left join events b on a.event_id = b.id where (a.forensic_date between :time_start and :time_end)',
  account: 'select distinct a.publish_account, a.publish_platform, b.name from samples a left join events b on a.event_id = b.id where a.publish_account != "" and (a.forensic_date between :time_start and :time_end)',
  person: 'select distinct name from persons',
  website: 'select distinct a.publish_platform  from samples a left join events b on a.event_id = b.id where a.publish_platform != "" and (a.forensic_date between :time_start and :time_end)',
  group: 'select distinct name from `group`',
  events: 'select name from events where type = 1 and (occurrence_time between :time_start and :time_end)',
  anli: 'select name from events where type = 1 and (occurrence_time between :time_start and :time_end)',
  taizhang: 'select a.content, b.name from taizhang a left join events b on a.event_id = b.id where (a.time between :time_start and :time_end)',
  control: 'select a.control_operation, a.control_number, a.sample_type, a.control_descript, b.name from `control_programs` a left join events b on a.event_id = b.id where (a.control_time between :time_start and :time_end)'
}

let itemQueryWithEventId = {
  keyword: ' and a.event_id = :event_id',
  sample: ' and a.event_id = :event_id',
  account: ' and a.event_id = :event_id',
  person: '',
  website: ' and a.event_id = :event_id',
  group: '',
  events: ' and id = :event_id',
  anli: ' and id = :event_id',
  taizhang: ' and a.event_id = :event_id',
  control: ' and a.event_id = :event_id'
}

module.exports.getItem = function(reqObj, cb) {
  let sql = ''
  if (!reqObj.eventId) {
    sql = itemQuery[reqObj.key]
  } else {
    sql = itemQuery[reqObj.key] + queryWithEventId[reqObj.key]
  }
  let pageSize = 50
  let currentPage = reqObj.currentPage || 1
  let pageStart = pageSize * (currentPage - 1)
  db.query(sql+' limit :pageStart, :pageSize', {
    replacements: {
      event_id: reqObj.eventId || 104,
      time_start: reqObj.time_start || '1900-12-21',
      time_end: reqObj.time_end || '2100-12-21',
      pageStart: pageStart,
      pageSize: pageSize
    }
  }).then((rows) => {
    let str = JSON.stringify(rows)
    let num = JSON.parse(str)
    cb(null, num[0])
  }).catch((err) => {
    cb(err, false)
  })
}
