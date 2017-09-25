let utils = {}

function toDou (n) {
  return n < 10 ? ('0' + n) : n
}

function formatCalendarDate (date) {
  let now = new Date()
  let str = ''
  if (date) {
    str = now.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate()
  }
  return str
}

function formatTime (date) {
  let temp = new Date(date)
  return temp.getFullYear() + '-' + toDou((temp.getMonth() + 1)) + '-' + toDou(temp.getDate())
}

function handleHarmlevel2Color (harm_level) {
  let level = parseInt(harm_level)
  let color = null
  switch (level) {
    case 0:
      color = 'default'
      break;
    case 1:
      color = 'yellow'
      break;
    case 2:
      color = 'orange'
      break;
    case 3:
      color= 'red'
      break;
    default:
      color = 'default'
  }
  return color
}

function formatTags (tags) {
  if (tags.length <= 0) {
    return []
  } else {
    let resObj = []
    tags.forEach((tag) => {
      resObj.push({id: tag.id, label: tag.name})
    })
    return resObj
  }
}

module.exports = utils

module.exports.formatCalendarDate = formatCalendarDate

module.exports.formatTime = formatTime

module.exports.handleHarmlevel2Color = handleHarmlevel2Color

module.exports.formatTags = formatTags
