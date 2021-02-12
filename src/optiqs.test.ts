import {updateState, reducer, OptiqsAction, createReducer} from './optiqs'
import {createStore} from 'redux'

type TestState = {
  name: string
}

test('updateState creates a standard action', () => {
  const actual = updateState<TestState>(() => ({name: 'bob'}))
  expect(actual).toHaveProperty('payload')
  expect(actual).toHaveProperty('type')
})

test('reducer with single update function applies that function to state', () => {
  const state: TestState = {
    name: 'bob'
  }
  const updateFn = (s: TestState) => ({name: `${s.name} marley`})
  const actual = reducer(state, updateState(updateFn))
  expect(actual.name).toBe('bob marley')
})

test('reducer with multiple update functions applies all functions to state', () => {
  const state: TestState = {
    name: 'bob'
  }
  const updateFn1 = (s: TestState) => ({name: `${s.name} marley`})
  const updateFn2 = (s: TestState) => ({name: `${s.name.repeat(2)}`})
  const updateFn3 = (s: TestState) => ({name: `${s.name} done`})
  const expected = updateFn3(updateFn2(updateFn1(state)))
  const actual = reducer(state, updateState([updateFn1, updateFn2, updateFn3]))
  expect(actual).toEqual(expected)
})

test('reducer is compatible with createStore', () => {
  type State = {a: string}
  const store = createStore<State, OptiqsAction<State>, void, void>(reducer)
  expect(store).toBeDefined()
})

test('createReducer allows passing of initial state', () => {
  type State = {a: string; b: number; c: string[]}
  const initialState = {
    a: 'a',
    b: 0,
    c: ['a', 'b', 'c']
  }
  const store = createStore<State, OptiqsAction<State>, void, void>(createReducer(initialState))
  const updateFn = (s: State) => ({...s, a: 'bob'})
  store.dispatch(updateState(updateFn))
  expect(store.getState()).toEqual(updateFn(initialState))
})
