export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'fixnow-secret',
    expiresIn: '1d',
  },
}
