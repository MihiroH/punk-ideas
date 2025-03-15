import { useEffect, useState } from 'react'

export interface UseExampleResult {
  data: string
  loading: boolean
  error: Error | null
}

export const useExample = (): UseExampleResult => {
  const [data, setData] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 実際のAPIコールをここに実装
        // 例: const response = await fetch('/api/ideas');

        // サンプルのため、タイムアウトでデータをセット
        setTimeout(() => {
          setData('サンプルデータがロードされました')
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
