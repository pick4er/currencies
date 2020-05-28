
const currencies = {
  usd: [60, 80],
  eur: [70, 90],
}

export default currency => {
  const [min, max] = currencies[currency]
  return parseFloat(
    (Math.random() * (max - min) + min).toFixed(4),
    10
  )
};
