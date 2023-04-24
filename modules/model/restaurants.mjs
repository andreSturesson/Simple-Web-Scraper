import { getLink, getRestaurantData } from './scrape.mjs'

/**
 *
 * @param {string}url an url.
 * @param {Array}commonday a list of days that work.
 * @returns {Array} a json list of all restaurants
 */
export async function getRestaurants (url, commonday) {
  const times = []
  for (let i = 0; i < commonday.length; i++) {
    const form = (await getLink(url)).querySelector('form').action
    const document = await getRestaurantData(url, form)
    const inputFields = document.querySelectorAll('input')
    for (const link of inputFields) {
      if (link.value.length === 7) {
        const days = separateRestaurantString(link.value)
        if (days.day === commonday[i]) {
          times.push(days)
        }
      } else {
      // const token = link.value Will maybe be used to confirm booking details
      }
    }
  }
  return times
}

/**
 *
 * @param {string}str a day. in (mon,tue,wed) format
 * @returns {Array} a json array of days.
 */
function separateRestaurantString (str) {
  const day = str.substring(0, 3).toLowerCase()
  const hour = str.substring(3, 5)
  const minutes = str.substring(5)
  const days = [
    { short: 'sun', long: 'Sunday' },
    { short: 'mon', long: 'Monday' },
    { short: 'tue', long: 'Tuesday' },
    { short: 'wed', long: 'Wednesday' },
    { short: 'thu', long: 'Thursday' },
    { short: 'fri', long: 'Friday' },
    { short: 'sat', long: 'Saturday' }
  ]
  const dayName = days.find(d => d.short === day).long
  const time = hour + ':' + minutes
  return { day: dayName, time, oldDay: day, oldTime: hour + minutes }
}
