import {Id, Text, Todo} from '../types/todos'
import {put, takeLatest} from '@redux-saga/core/effects'
import {updateState} from '@optiqs/optiqs'
import {selectTodos, selectTodoCompleted} from '../lenses'

export const append = <T>(item: T) => (arr: T[]) => arr.concat(item)
export const toggle = (item: boolean) => !item

let nextTodoId: Id = 0

export const addTodo = (text: Text) => {
  return {
    type: 'ADD_TODO',
    payload: {
      id: nextTodoId++,
      text
    }
  }
}

function* addTodoSaga({payload}: ReturnType<typeof addTodo>) {
  const todo: Todo = {...payload, completed: false}
  yield put(updateState(selectTodos.modify(append(todo))))
}

export const toggleTodo = (id: Id) => {
  return {
    type: 'TOGGLE_TODO',
    payload: {
      id
    }
  }
}

function* toggleTodoSaga({payload: {id}}: ReturnType<typeof toggleTodo>) {
  yield put(updateState(selectTodoCompleted(id).modify(toggle)))
}

export const todoSagas = [
  takeLatest('ADD_TODO', addTodoSaga),
  takeLatest('TOGGLE_TODO', toggleTodoSaga)
]
