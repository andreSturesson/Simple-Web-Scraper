import { getDocumentsByURL, getCalendars, getMovies, getRestaurant } from './modules/controller/scraperManager.mjs'
const startUrl = process.argv[2]
startApp()

async function startApp () {
  const url = await getDocumentsByURL(startUrl)
  console.log('Scraping links...')
  const recommendedDay = await getCalendars(url.calendar)
  console.log('Scraping avalible days...')
  const avalibleMovieTimes = await getMovies(url.cinema, recommendedDay)
  console.log('Scraping showtimes...')
  const restaurantsTimes = await getRestaurant(url.restaurant, recommendedDay)
  console.log('Scraping possible reservations...')
  console.log('\x1b[36m' + '\x1b[5m' + 'Recommendations')
  console.log('\x1b[0m' + '===============')
  findRecommendations(recommendedDay, avalibleMovieTimes, restaurantsTimes)
}

function findRecommendations (days, movies, restaurant) {
  let count
  days.forEach(day => {
    movies.forEach(movie1 => {
      restaurant.forEach(reservation => {
        const movieEnd = new Date('2023-01-01T' + movie1.time + ':00.00')
        movieEnd.setMinutes(movieEnd.getMinutes() + 120)
        const resTime = new Date('2023-01-01T' + reservation.time + ':00.00')
        if (movieEnd <= resTime && movie1.day === day && reservation.day === day) {
          count++
          console.log('\x1b[1m* ' + '\x1b[36m' + 'On ' + day + '\x1b[37m' + ' the movie ' + '\x1b[33m' + '"' + movie1.movie + '"' + '\x1b[37m' + ' starts at ' + '\x1b[34m' + movie1.time + '\x1b[37m' + ' and there is a free table between ' + '\x1b[34m' + reservation.time.replace(':', '-') + '\x1b[37m' + '.')
        }
      })
    })
  })
  if (count === 0) {
    console.log('Unfortunately no recommendations could be found. Adjust your calendar and try again...')
  }
}
