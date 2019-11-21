import {connect} from 'react-redux'

import {toggleTodo} from '../actions/todos'
import TodoList from '../components/TodoList'

import {State, Dispatch} from '../types'
import {selectVisibleTodos} from '../lenses'

const mapStateToProps = (state: State) => {
  return {
    todos: selectVisibleTodos.get(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onTodoClick: (id: number) => {
      dispatch(toggleTodo(id))
    }
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TodoList)
