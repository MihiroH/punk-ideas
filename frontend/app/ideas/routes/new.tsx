import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { useIdeaStore } from '~/ideas/store'
import type { IdeaFormData } from '~/ideas/types/example'

export default function IdeaNewPage() {
  const navigate = useNavigate()
  const { addIdea, setLoading, setError } = useIdeaStore()

  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')

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

    setLoading(true)
    try {
      // 実際のAPIコールをここに実装
      // 例: const response = await fetch('/api/ideas', { method: 'POST', body: JSON.stringify(formData) });

      // サンプルのため、タイムアウトで作成
      setTimeout(() => {
        const newIdea = {
          id: `idea-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user123',
        }

        addIdea(newIdea)
        setLoading(false)
        navigate('/ideas')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="idea-new-page">
      <h1>新しいアイデアを作成</h1>

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
          <button type="submit">作成</button>
          <Link to="/ideas">キャンセル</Link>
        </div>
      </form>
    </div>
  )
}
