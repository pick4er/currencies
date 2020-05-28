
const periodToSeconds = {
  '1m': 60,
  '5m': 300,
  '1h': 3600,
  '1d': 86400,
}

export default period => periodToSeconds[period]
