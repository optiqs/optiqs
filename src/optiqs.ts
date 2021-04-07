import {AnyAction, Action, Reducer} from 'redux'

export type OptiqsStateUpdateFn<S> = (fn: S) => S

export const OPTIQS_UPDATE = '__OPTIQS/UPDATE__'
export type OPTIQS_UPDATE = typeof OPTIQS_UPDATE

export type OptiqsActionCreatorPayload<S> = OptiqsStateUpdateFn<S> | OptiqsStateUpdateFn<S>[]

export interface OptiqsAction<S> {
  readonly type: OPTIQS_UPDATE
  readonly payload: OptiqsActionCreatorPayload<S>
}

export interface OptiqsActionCreator {
  <S>(payload: OptiqsActionCreatorPayload<S>): OptiqsAction<S>
  toString(): string
}

/**
 * Creates an action that will be used in the reducer to update state in the store.
 * @param payload A function or array of functions that will be used in the reducer.
 * @returns An action with the given functions as the payload.
 */
// Using named functions can help with debugging stack traces etc.
export function updateState<S>(payload: OptiqsActionCreatorPayload<S>): OptiqsAction<S> {
  return {
    type: OPTIQS_UPDATE,
    payload
  }
}

// Overriding the toString method mainly allows for it to work better with redux-saga
updateState.toString = () => OPTIQS_UPDATE

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isOptiqsAction = (action: AnyAction): action is OptiqsAction<any> =>
  action.type === OPTIQS_UPDATE

/**
 * Reducer used to handle Optiqs actions
 * @param state The current state.
 * @param action The dispatched action. You can optionally provide a type here to strongly type this reducer to only accept specific actiopns.
 * @returns The updated state.
 */
export const reducer = <S, A extends Action = AnyAction>(state: S, action: A): S => {
  return isOptiqsAction(action)
    ? Array.isArray(action.payload)
      ? action.payload.reduce((st, fn) => fn(st), state)
      : action.payload(state)
    : state
}

/**
 * Creates a reducer, seeding it with the provided initial state.
 * @param initialState The initial state of the reducer
 * @returns The reducer.
 */
export const createReducer = <S, A extends Action = AnyAction>(initialState: S): Reducer<S, A> =>
  function optiqsReducer(state = initialState, action) {
    return reducer(state, action)
  }

export type CreateReducer = typeof createReducer

export type OptiqsReducer = typeof reducer
