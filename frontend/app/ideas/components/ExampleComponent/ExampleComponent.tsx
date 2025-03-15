import './ExampleComponent.css'
import { useExample } from './hooks/useExample'

export function ExampleComponent() {
  const { data, loading } = useExample()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="example-component">
      <h1>Example Component</h1>
      <p>{data}</p>
    </div>
  )
}
