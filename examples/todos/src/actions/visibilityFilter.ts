import {VisibilityFilter, VisibilityFilterAction} from '../types/visibilityFilter'

export const setVisibilityFilter = (filter: VisibilityFilter): VisibilityFilterAction => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    payload: {
      filter
    }
  }
}
