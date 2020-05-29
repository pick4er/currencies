const allowedOrigins =
  'http://localhost:3000,https://rub-converter.herokuapp.com'
const origin = null

export default async function middleware(ctx, next) {
  if (process.env.NODE_ENV === 'development') {
    ctx.set({ 'Access-Control-Allow-Origin': '*' })
  } else if (allowedOrigins.includes(ctx.headers.origin)) {
    ctx.set({
      'Access-Control-Allow-Origin': ctx.headers.origin,
      Vary: 'origin',
    })
  } else {
    ctx.set({ 'Access-Control-Allow-Origin': origin })
  }

  ctx.set({
    'Access-Control-Allow-Methods':
      'GET, POST, PATCH, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  })

  await next()
}
