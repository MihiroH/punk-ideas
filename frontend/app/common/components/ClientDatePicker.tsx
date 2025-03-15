import { DatePicker } from 'antd'
import { useEffect, useState } from 'react'

export function ClientDatePicker() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <DatePicker />
}
