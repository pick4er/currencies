import qs from 'query-string'

const BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://rub-converter.herokuapp.com'
    : 'http://localhost:8080'

export function getFullUrl(url, isFullUrl, query = {}) {
  const fullUrl = isFullUrl ? url : `${BACKEND_URL}/${url}`
  const queryString =
    typeof query === 'string'
      ? query
      : qs.stringify({ ...query })

  return `${fullUrl}?${queryString}`
}

function getOptions() {
  return {
    method: 'GET',
  }
}

// works only on GET request
export default function api(url, props) {
  const { query = {}, isFullUrl = false } = props

  const fullUrl = getFullUrl(url, isFullUrl, query)
  const options = getOptions()

  return fetch(fullUrl, options)
    .then((res) => {
      return res.text().then((text) => {
        try {
          return JSON.parse(text)
        } catch (e) {
          return text
        }
      })
    })
    .catch((e) =>
      Promise.reject(
        new Error({
          error: e,
          message: 'Cannot parse the response',
        })
      )
    )
}
