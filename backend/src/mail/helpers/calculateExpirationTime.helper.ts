import { add } from 'date-fns'

// @example calculateExpirationTime('30m')
// @example calculateExpirationTime('1h')
// @example calculateExpirationTime('7d')
export const calculateExpirationTime = (duration: string): Date => {
  const now = new Date()
  const matches = duration.match(/^(\d+)([mhd])$/)

  if (!matches) {
    throw new Error(`Invalid duration format. Expected format is like "30m", "1h", "7d", but got ${duration}.`)
  }

  const [, valueStr, unit] = matches
  const value = Number.parseInt(valueStr, 10)

  const unitMap: Record<string, { [key: string]: number }> = {
    m: { minutes: value },
    h: { hours: value },
    d: { days: value },
  }

  return add(now, unitMap[unit])
}
