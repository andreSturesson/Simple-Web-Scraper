import jsdom from 'jsdom'
const { JSDOM } = jsdom
/**
 *
 * @param {string}url a day that works.
 * @returns {string} a list of all URLs scraped.
 */
export async function getURLs (url) {
  const urls = []
  await JSDOM.fromURL(url).then(dom => {
    const links = dom.window.document.querySelectorAll('a')
    for (const link of links) {
      urls.push(link.href)
    }
  })
  return urls
}

/**
 *
 * @param {string}url a day that works.
 * @returns {Document} A JSDOM document.
 */
export async function getLink (url) {
  const dom = JSDOM.fromURL(url)
  return (await dom).window.document
}

/**
 *
 * @param {string}base an url before request
 * @param {string}link an url with complete request link.
 * @returns {Document} a JSDOM object.
 */
export async function getRestaurantData (base, link) {
  const post = {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: 'username=zeke&password=coys&submit=login',
    redirect: 'manual',
    method: 'POST'
  }
  const postReq = await fetch(link, post)
  const get = {
    headers: {
      cookie: postReq.headers.get('set-cookie')
    }
  }
  const getReq = await fetch(base + postReq.headers.get('location'), get)
  return new JSDOM(await getReq.text()).window.document
}
