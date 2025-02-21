// @example parseDuration('30m')
// @example parseDuration('1h')
// @example parseDuration('7d')
export const parseDuration = (duration: string): number => {
  const matches = duration.match(/^(\d+)([mhd])$/)

  if (!matches) {
    throw new Error(`Invalid duration format. Expected format is like "30m", "1h", "7d", but got ${duration}.`)
  }

  const [, valueStr, unit] = matches
  const value = Number.parseInt(valueStr, 10)

  const unitMap: Record<string, number> = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 60 * 60 * 24 * 1000,
  }

  return value * unitMap[unit]
}
