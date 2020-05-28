
export default (historyData = []) => historyData.map(
  ({ t, o }) => ({ timestamp: t, open: parseFloat(0, 10) })
)
