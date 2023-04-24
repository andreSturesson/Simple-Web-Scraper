import { getURLs } from '../model/scrape.mjs'
import { getCalendar } from '../model/calendar.mjs'
import { getCinema } from '../model/cinema.mjs'
import { getRestaurants } from '../model/restaurants.mjs'

/**
 *
 * @param {string} startURL string.
 */
export async function getDocumentsByURL (startURL) {
  const url = await getURLs(startURL)
  return { calendar: url[0], cinema: url[1], restaurant: url[2] }
}

/**
 *
 * @param {string} url string.
 */
export async function getCalendars (url) {
  return await getCalendar(url)
}

/**
 *
 * @param {string} url string.
 * @param {Array} days A list of days that work.
 */
export async function getMovies (url, days) {
  return await getCinema(url, days)
}

/**
 *
 * @param {string} url string.
 * @param {Array} days A list of days that work.
 */
export async function getRestaurant (url, days) {
  return await getRestaurants(url, days)
}
