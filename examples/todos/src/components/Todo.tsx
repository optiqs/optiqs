import React from 'react'

import {Text} from '../types/todos'

export type Props = {
  onClick: () => void
  completed: boolean
  text: Text
}

const Todo = ({onClick, completed, text}: Props) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)

export default Todo
