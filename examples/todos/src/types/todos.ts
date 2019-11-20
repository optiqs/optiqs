export type Id = number

export type Text = string

export type Todo = {
  readonly id: Id
  readonly text: Text
  readonly completed: boolean
}

export type Todos = Array<Todo>

export type TodosState = {
  readonly todos: Todos
}

export type TodosAction =
  | {
      readonly type: 'ADD_TODO'
      readonly payload: {
        readonly id: Id
        readonly text: Text
      }
    }
  | {
      readonly type: 'TOGGLE_TODO'
      readonly payload: {
        readonly id: Id
      }
    }
