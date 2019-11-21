import {VisibilityFilter, VisibilityFilterAction} from '../types/visibilityFilter'
import {put, takeLatest} from '@redux-saga/core/effects'
import {updateState} from '@myopia/optics'
import {selectVisibilityFilter} from '../lenses'

export const setVisibilityFilter = (filter: VisibilityFilter): VisibilityFilterAction => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    payload: {
      filter
    }
  }
}

function* setVisibilityFilterSaga({payload: {filter}}: ReturnType<typeof setVisibilityFilter>) {
  yield put(updateState(selectVisibilityFilter.set(filter)))
}

export const visibilityFilterSagas = [takeLatest('SET_VISIBILITY_FILTER', setVisibilityFilterSaga)]
