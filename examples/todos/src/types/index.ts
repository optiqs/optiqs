import {TodosState} from './todos'
import {VisibilityFilterState} from './visibilityFilter'
import {Dispatch as ReduxDispatch, Action} from 'redux'

export interface StandardAction<P> extends Action {
  payload: P
}
export type State = TodosState & VisibilityFilterState
export type Dispatch = ReduxDispatch<StandardAction<any>>
