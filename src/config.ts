export const production = process.env.NODE_ENV === 'production'

export const config = {
  FRONTEND_URL: 'https://auth.itsolve.be',
  VERSION: production ? '1.0.0' : '1.0.0-beta',
  BACKEND_URL: 'https://auth-api.itsolve.be/v1',
}
