export interface JwtPayload {
  email: string
  sub: number
}

export interface JwtSignOptions {
  secret: string
  expiresIn: string
}
