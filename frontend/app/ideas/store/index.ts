import type { Idea } from '~/ideas/types/example'

interface IdeaState {
  ideas: Idea[]
  selectedIdea: Idea | null
  loading: boolean
  error: string | null
}

interface IdeaActions {
  setIdeas: (ideas: Idea[]) => void
  setSelectedIdea: (idea: Idea | null) => void
  addIdea: (idea: Idea) => void
  updateIdea: (idea: Idea) => void
  deleteIdea: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// シンプルなストア実装
const state: IdeaState = {
  ideas: [],
  selectedIdea: null,
  loading: false,
  error: null,
}

const actions: IdeaActions = {
  setIdeas: (ideas: Idea[]) => {
    state.ideas = ideas
  },
  setSelectedIdea: (idea: Idea | null) => {
    state.selectedIdea = idea
  },
  addIdea: (idea: Idea) => {
    state.ideas = [...state.ideas, idea]
  },
  updateIdea: (idea: Idea) => {
    state.ideas = state.ideas.map((i) => (i.id === idea.id ? idea : i))
    if (state.selectedIdea?.id === idea.id) {
      state.selectedIdea = idea
    }
  },
  deleteIdea: (id: string) => {
    state.ideas = state.ideas.filter((i) => i.id !== id)
    if (state.selectedIdea?.id === id) {
      state.selectedIdea = null
    }
  },
  setLoading: (loading: boolean) => {
    state.loading = loading
  },
  setError: (error: string | null) => {
    state.error = error
  },
}

// ストアを使用するためのフック
export const useIdeaStore = () => {
  return { ...state, ...actions }
}
