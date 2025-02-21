// @example parseFileSize('500B') // 500
// @example parseFileSize('10KB') // 10240
// @example parseFileSize('5MB') // 5242880
// @example parseFileSize('1GB') // 1073741824
export const parseFileSize = (size: string): number => {
  const matches = size.match(/^(\d+)(B|KB|MB|GB)$/i)

  if (!matches) {
    throw new Error(`Invalid file size format. Expected format is like "500B", "10KB", "5MB", but got ${size}.`)
  }

  const [, valueStr, unit] = matches
  const value = Number.parseInt(valueStr, 10)

  const unitMap: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  }

  return value * unitMap[unit.toUpperCase()]
}
