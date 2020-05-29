function getLatest(ctx) {
  const { currency } = ctx.query

  ctx.set({ 'Content-Type': 'application/json' })
  ctx.body = {
    value: ctx.rates[currency.toLowerCase()],
    last_changed: ctx.last_changed,
  }
  ctx.status = 200
}

export default getLatest
