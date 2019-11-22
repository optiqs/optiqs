export type OptiqsStateUpdateFn<S> = (fn: S) => S

export type OptiqsAction<S> = {
  readonly type: '__OPTIQS/UPDATE__'
  readonly payload: OptiqsStateUpdateFn<S> | OptiqsStateUpdateFn<S>[]
}

export type OptiqsActionCreatorPayload<S> = OptiqsStateUpdateFn<S> | OptiqsStateUpdateFn<S>[]

export type OptiqsActionCreator = <S>(payload: OptiqsActionCreatorPayload<S>) => OptiqsAction<S>

export type OptiqsReducer = <S>(state: S | undefined, action: OptiqsAction<S>) => S

export type CreateReducer = <S>(
  initialState: S
) => (state: S | undefined, action: OptiqsAction<S>) => S

export const updateState: OptiqsActionCreator = payload => ({
  type: '__OPTIQS/UPDATE__',
  payload
})

export const reducer: OptiqsReducer = (state, action) =>
  action.type === '__OPTIQS/UPDATE__'
    ? Array.isArray(action.payload)
      ? action.payload.reduce((st, fn) => fn(st), state)
      : action.payload(state)
    : state

export const createReducer: CreateReducer = initialState => (state = initialState, action) =>
  reducer(state, action)
