export type VisibilityFilter = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED'

export type VisibilityFilterState = {
  readonly visibilityFilter: VisibilityFilter
}

export type VisibilityFilterAction = {
  readonly type: 'SET_VISIBILITY_FILTER'
  readonly payload: {
    readonly filter: VisibilityFilter
  }
}
