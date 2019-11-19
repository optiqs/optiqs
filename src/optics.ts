export type OpticsStateUpdateFn<S> = (fn: S) => S

export type OpticsAction<S> = {
  type: 'OPTICS/UPDATE'
  payload: OpticsStateUpdateFn<S> | OpticsStateUpdateFn<S>[]
}

export type OpticsActionCreatorPayload<S> = OpticsStateUpdateFn<S> | OpticsStateUpdateFn<S>[]

export type OpticsActionCreator<S> = (payload: OpticsActionCreatorPayload<S>) => OpticsAction<S>

export const updateState = <S>(payload: OpticsActionCreatorPayload<S>): OpticsAction<S> => ({
  type: 'OPTICS/UPDATE',
  payload
})

export const reducer = <S>(state: S, action: OpticsAction<S>) =>
  state
    ? Array.isArray(action.payload)
      ? action.payload.reduce((st, fn) => fn(st), state)
      : action.payload(state)
    : null
