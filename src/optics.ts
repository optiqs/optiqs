export type OpticsStateUpdateFn<S> = (fn: S) => S

export type OpticsAction<S> = {
  readonly type: '__OPTICS/UPDATE__'
  readonly payload: OpticsStateUpdateFn<S> | OpticsStateUpdateFn<S>[]
}

export type OpticsActionCreatorPayload<S> = OpticsStateUpdateFn<S> | OpticsStateUpdateFn<S>[]

export type OpticsActionCreator = <S>(payload: OpticsActionCreatorPayload<S>) => OpticsAction<S>

export type OpticsReducer = <S = any>(state: S | undefined, action: OpticsAction<S>) => S

export const updateState: OpticsActionCreator = payload => ({
  type: '__OPTICS/UPDATE__',
  payload
})

export const reducer: OpticsReducer = (state, action) =>
  state && action.type === '__OPTICS/UPDATE__'
    ? Array.isArray(action.payload)
      ? action.payload.reduce((st, fn) => fn(st), state)
      : action.payload(state)
    : null
