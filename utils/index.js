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

module.exports = utils

module.exports.formatCalendarDate = formatCalendarDate

module.exports.formatTime = formatTime
