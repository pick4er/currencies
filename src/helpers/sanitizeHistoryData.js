
export default (historyData = []) => historyData.map(
  ({ t, o }) => ({ timestamp: t, open: parseFloat(o, 10) })
)
