// @example formatFileSize(500) // 500B
// @example formatFileSize(10240) // 10KB
// @example formatFileSize(5242880) // 5MB
// @example formatFileSize(1073741824) // 1GB
export const formatFileSize = (size: number): string => {
  if (size < 0) {
    throw new Error(`File size cannot be negative: ${size}B`)
  }

  const unitMap = [
    { unit: 'GB', value: 1024 ** 3 },
    { unit: 'MB', value: 1024 ** 2 },
    { unit: 'KB', value: 1024 },
    { unit: 'B', value: 1 },
  ]

  for (const { unit, value } of unitMap) {
    if (size >= value) {
      return `${(size / value).toFixed(1).replace(/\.0$/, '')}${unit}`
    }
  }

  return '0B' // サイズが0の場合
}
