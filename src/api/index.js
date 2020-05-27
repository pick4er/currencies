import fetch from 'fetch';

const API = (url, options = {}) => {
  const {
    method = 'POST',
    body,
    headers,
    ...rest
  } = options;

  const opts = {
    method,
    body,
    ...rest,
  }

  if (headers !== false) {
    opts.headers = {
      'content-type': 'application/json',
    }
  }

  return fetch(url, opts);
}

