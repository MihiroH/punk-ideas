export interface Idea {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  userId: string
  tags: string[]
}

export interface IdeaFormData {
  title: string
  description: string
  tags: string[]
}

export interface IdeaListResponse {
  ideas: Idea[]
  totalCount: number
  page: number
  pageSize: number
}

export interface IdeaDetailResponse {
  idea: Idea
}
