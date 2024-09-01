import { add } from 'date-fns'

// @example calculateExpirationTime('1h')
// @example calculateExpirationTime('30m')
// @example calculateExpirationTime('7d')
export const calculateExpirationTime = (expirationSetting: string): Date => {
  const now = new Date()
  const unit = expirationSetting.slice(-1)
  const value = Number.parseInt(expirationSetting.slice(0, -1), 10)

  switch (unit) {
    case 'm':
      return add(now, { minutes: value })
    case 'h':
      return add(now, { hours: value })
    case 'd':
      return add(now, { days: value })
    default:
      throw new Error(
        `Invalid expirationSetting format. Expected format is like "30m", "1h", "7d", but got ${expirationSetting}.`,
      )
  }
}
