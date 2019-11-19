import React, {Component, FormEvent} from 'react'
import {connect} from 'react-redux'

import {addTodo} from '../actions/todos'

import {Dispatch} from '../types'

export type Props = {
  dispatch: Dispatch
}

export type State = {
  value: string
}

class AddTodo extends Component<Props, State> {
  state = {
    value: ''
  }
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({value: event.currentTarget.value})
  }
  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!this.state.value.trim()) {
      return
    }
    this.props.dispatch(addTodo(this.state.value))
    this.setState({value: ''})
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input value={this.state.value} onChange={this.handleChange} />
          <button type='submit'>Add Todo</button>
        </form>
      </div>
    )
  }
}

export default connect()(AddTodo)
