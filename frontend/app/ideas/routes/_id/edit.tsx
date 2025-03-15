import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { useIdeaStore } from '~/ideas/store'
import type { IdeaFormData } from '~/ideas/types/example'

export default function IdeaEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedIdea, loading, error, setSelectedIdea, updateIdea, setLoading, setError } = useIdeaStore()

  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return

      setLoading(true)
      try {
        // 実際のAPIコールをここに実装
        // 例: const response = await fetch(`/api/ideas/${id}`);

        // サンプルのため、タイムアウトでデータをセット
        setTimeout(() => {
          const idea = {
            id,
            title: 'サンプルアイデア',
            description: 'これはサンプルのアイデア詳細です。実際のアプリケーションでは、APIからデータを取得します。',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: 'user123',
            tags: ['サンプル', 'テスト'],
          }

          setSelectedIdea(idea)
          setFormData({
            title: idea.title,
            description: idea.description,
            tags: [...idea.tags],
          })
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
        setLoading(false)
      }
    }

    fetchIdea()
  }, [id, setSelectedIdea, setLoading, setError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id || !selectedIdea) return

    setLoading(true)
    try {
      // 実際のAPIコールをここに実装
      // 例: const response = await fetch(`/api/ideas/${id}`, { method: 'PUT', body: JSON.stringify(formData) });

      // サンプルのため、タイムアウトで更新
      setTimeout(() => {
        const updatedIdea = {
          ...selectedIdea,
          ...formData,
          updatedAt: new Date().toISOString(),
        }

        updateIdea(updatedIdea)
        setLoading(false)
        navigate(`/ideas/${id}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
      setLoading(false)
    }
  }

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
    <div className="idea-edit-page">
      <h1>アイデアを編集</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">説明</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">タグ</label>
          <div className="tag-input-container">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="タグを入力..."
            />
            <button
              type="button"
              onClick={handleAddTag}
            >
              追加
            </button>
          </div>

          <div className="tags-list">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="tag-item"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">保存</button>
          <Link to={`/ideas/${id}`}>キャンセル</Link>
        </div>
      </form>
    </div>
  )
}
