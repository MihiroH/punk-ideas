import { useEffect } from 'react'
import { Link, useParams } from 'react-router'

import { useIdeaStore } from '~/ideas/store'

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selectedIdea, loading, error, setSelectedIdea, setLoading, setError } = useIdeaStore()

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return

      setLoading(true)
      try {
        // 実際のAPIコールをここに実装
        // 例: const response = await fetch(`/api/ideas/${id}`);

        // サンプルのため、タイムアウトでデータをセット
        setTimeout(() => {
          setSelectedIdea({
            id,
            title: 'サンプルアイデア',
            description: 'これはサンプルのアイデア詳細です。実際のアプリケーションでは、APIからデータを取得します。',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: 'user123',
            tags: ['サンプル', 'テスト'],
          })
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
        setLoading(false)
      }
    }

    fetchIdea()

    // クリーンアップ
    return () => {
      setSelectedIdea(null)
    }
  }, [id, setSelectedIdea, setLoading, setError])

  if (loading) {
    return <div>アイデアを読み込み中...</div>
  }

  if (error) {
    return <div>エラーが発生しました: {error}</div>
  }

  if (!selectedIdea) {
    return <div>アイデアが見つかりませんでした</div>
  }

  return (
    <div className="idea-detail-page">
      <div className="idea-header">
        <h1>{selectedIdea.title}</h1>
        <div className="idea-actions">
          <Link
            to={`/ideas/${id}/edit`}
            className="edit-button"
          >
            編集
          </Link>
          <button
            type="button"
            className="delete-button"
          >
            削除
          </button>
        </div>
      </div>

      <div className="idea-meta">
        <span>作成日: {new Date(selectedIdea.createdAt).toLocaleDateString()}</span>
        <span>更新日: {new Date(selectedIdea.updatedAt).toLocaleDateString()}</span>
      </div>

      <div className="idea-tags">
        {selectedIdea.tags.map((tag: string) => (
          <span
            key={tag}
            className="idea-tag"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="idea-description">
        <p>{selectedIdea.description}</p>
      </div>

      <Link
        to="/ideas"
        className="back-button"
      >
        一覧に戻る
      </Link>
    </div>
  )
}
