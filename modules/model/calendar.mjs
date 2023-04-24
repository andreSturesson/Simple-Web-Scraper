import { getLink } from './scrape.mjs'

/**
 *
 * @param {string} link An url.
 */
export async function getCalendar (link) {
  const results = []
  const document = await getLink(link)
  const title = document.querySelectorAll('a')
  for (const link of title) {
    const freeDays = await getEveryoneCalendar(link.href)
    results.push(freeDays)
  }
  return findDayThatWorks(results)
}

/**
 *
 * @param {string} url An URL.
 */
async function getEveryoneCalendar (url) {
  const data = []
  const doc = await getLink(url)
  const table = doc.querySelector('table')
  const rows = table.querySelectorAll('tr')
  const temp = []
  const dayOfWeekColumn = table.querySelectorAll('th')
  dayOfWeekColumn.forEach(element => {
    temp.push(element.textContent)
  })
  for (const row of rows) {
    const freeColumn = row.querySelectorAll('td')
    for (let i = 0; i < freeColumn.length; i++) {
      if (freeColumn[i].textContent === 'ok' || freeColumn[i].textContent === 'OK' || freeColumn[i].textContent === 'oK' || freeColumn[i].textContent === 'Ok') {
        data.push(temp[i])
      }
    }
  }
  return data
}

/**
 *
 * @param {Array} results A list of days.
 * @returns {Array}  A json list of days that work.
 */
function findDayThatWorks (results) {
  let days = new Set(results[0])
  for (let i = 1; i < results.length; i++) {
    days = new Set([...days].filter(day => results[i].includes(day)))
  }
  return Array.from(days)
}
