import { getLink } from './scrape.mjs'

/**
 *
 * @param {string}url a url.
 * @param {Array}commonDay a list of days that work.
 * @returns {Array} a json array of movies.
 */
export async function getCinema (url, commonDay) {
  const movieTimes = []
  const document = await getLink(url)
  for (let i = 0; i < commonDay.length; i++) {
    let dayValue = ''
    let movieValue = ''
    const dayData = document.getElementById('day')
    const movieData = document.getElementById('movie')
    for (const link of dayData) {
      if (commonDay[i] === link.innerHTML) {
        dayValue = link.value
      }
    }
    for (const link of movieData) {
      if (link.innerHTML !== '--- Pick a Movie ---') {
        movieValue = link.value
        // Quess this counts as AJAX get request and therefore can be hardcoded...
        await fetch(url + '/check?day=' + dayValue + '&movie=' + movieValue)
          .then((response) => response.json())
          .then((data) => data.forEach(element => {
            if (element.status === 1) {
              movieTimes.push({ day: commonDay[i], movie: link.innerHTML, movieId: movieValue, time: element.time })
            }
          }))
      }
    }
  }
  return movieTimes
}
