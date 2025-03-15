import { Link } from 'react-router'

import { ExampleComponent } from '~/ideas/components/ExampleComponent/ExampleComponent'
import { useIdeaStore } from '~/ideas/store'
import type { Idea } from '~/ideas/types/example'

export default function IdeasIndexPage() {
  const { ideas, loading, error } = useIdeaStore()

  if (loading) {
    return <div>アイデア一覧を読み込み中...</div>
  }

  if (error) {
    return <div>エラーが発生しました: {error}</div>
  }

  return (
    <div className="ideas-page">
      <h1>アイデア一覧</h1>

      <Link
        to="/ideas/new"
        className="create-idea-button"
      >
        新しいアイデアを作成
      </Link>

      <ExampleComponent />

      <div className="ideas-list">
        {ideas.length === 0 ? (
          <p>アイデアがまだありません。新しいアイデアを作成してみましょう！</p>
        ) : (
          ideas.map((idea: Idea) => (
            <div
              key={idea.id}
              className="idea-card"
            >
              <h2>{idea.title}</h2>
              <p>{idea.description.substring(0, 100)}...</p>
              <div className="idea-tags">
                {idea.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="idea-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={`/ideas/${idea.id}`}>詳細を見る</Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
