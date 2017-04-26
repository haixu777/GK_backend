let utils = {}


function formatCalendarDate (date) {
  let now = new Date()
  let str = ''
  if (date) {
    str = now.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate()
  }
  return str
}

module.exports = utils

module.exports.formatCalendarDate = formatCalendarDate
