
export function getFullUrl(url, isFullUrl) {
  return isFullUrl ? url : `${BACKEND_URL}/${url}`;
}

export function prepareBody(body, method, headers = {}) {
  const contentType = headers['content-type']
  if (!methodsWithBody.includes(method)) {
    return;
  }

  if (contentType === 'application/json') {
    return JSON.stringify({ ...body });
  }

  return body
}

function getOptions(props) {
  const {
    headers,
    body,
    method,
    ...otherOptions
  } = props;

  return {
    headers: new Headers({ ...headers }),
    body: prepareBody(body, method, headers),
    mode: 'cors',
    method,
    ...otherOptions
  };
}

export default function api(url, props = {}) {
  const { isFullUrl = false } = props;

  const fullUrl = getFullUrl(url, isFullUrl);
  const options = getOptions(props);

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
