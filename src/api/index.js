import fetch from 'api/fetch';

export const getHistoryRates = query =>
  fetch('history', { query });

export const getLatestRates = query =>
  fetch('latest', { query });
