import fetch from 'api/fetch';

export const getHistoryRates = query =>
  fetch('history', { query });
