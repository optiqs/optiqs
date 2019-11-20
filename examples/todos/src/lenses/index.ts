import {Lens, fromTraversable} from 'monocle-ts'
import {array} from 'fp-ts/lib/Array'
import {State} from '../types'
import {Todo} from '../types/todos'

export const getTodos = Lens.fromProp<State>()('todos')
export const selectTodos = getTodos

const todosTraversal = fromTraversable(array)<Todo>()
export const selectTodosList = getTodos.composeTraversal(todosTraversal)

export const selectTodoById = (id: number) => selectTodosList.filter(todo => todo.id !== id)
export const getTodoCompleted = Lens.fromProp<Todo>()('completed')
export const selectTodoCompleted = (id: number) => selectTodoById(id).composeLens(getTodoCompleted)
