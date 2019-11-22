import {Lens, fromTraversable} from 'monocle-ts'
import {array} from 'fp-ts/lib/Array'
import {State} from '../types'
import {Todo} from '../types/todos'
import '@optiqs/projections'

export const getTodos = Lens.fromProp<State>()('todos')
export const selectTodos = getTodos

const todosTraversal = fromTraversable(array)<Todo>()
export const selectTodosList = getTodos.composeTraversal(todosTraversal)

export const selectTodoById = (id: number) => selectTodosList.filter(todo => todo.id === id)
export const getTodoCompleted = Lens.fromProp<Todo>()('completed')
export const selectTodoCompleted = (id: number) => selectTodoById(id).composeLens(getTodoCompleted)

export const selectVisibilityFilter = Lens.fromProp<State>()('visibilityFilter')

export const selectVisibleTodos = selectTodos
  .asProjection()
  .combineLens(selectVisibilityFilter, (todos, visibilityFilter) =>
    visibilityFilter !== 'SHOW_ALL'
      ? todos.filter(todo =>
          visibilityFilter === 'SHOW_COMPLETED' ? todo.completed : !todo.completed
        )
      : todos
  )
