import qs from 'query-string';

// since api not valuable, it's ok to keep the key in front
const ACCESS_KEY =
  'ldczUJcFBZ016WYxGjPYmMjy00qFHYpyQmVvEphakS8jGn5yEj';
const BACKEND_URL = 'https://fcsapi.com/api-v2/forex';

export function getFullUrl(url, isFullUrl, query = {}) {
  const fullUrl = isFullUrl ? url : `${BACKEND_URL}/${url}`;
  const queryString = typeof query === 'string'
    ? query
    : qs.stringify({
        ...query,
        access_key: ACCESS_KEY
      })

  return fullUrl + `?${queryString}`
}

function getOptions() {
  return {
    mode: 'cors',
    method: 'GET',
  };
}

// works only on GET request
export default function api(url, props) {
  const {
    query = {},
    isFullUrl = false,
  } = props;

  const fullUrl = getFullUrl(url, isFullUrl, query);
  const options = getOptions();

  return fetch(fullUrl, options)
    .then(res => {
      return res
        .text()
        .then(text => {
          try {
            return JSON.parse(text);
          } catch (e) {
            return text;
          }
        })
    })
    .catch(e => Promise.reject({
      error: e,
      message: 'Cannot parse the response',
    }));
}
