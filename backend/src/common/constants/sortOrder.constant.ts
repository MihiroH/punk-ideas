export const SORT_ORDER = {
  asc: 'asc',
  desc: 'desc',
} as const

export type KSortOrders = keyof typeof SORT_ORDER
export type VSortOrders = (typeof SORT_ORDER)[KSortOrders]
