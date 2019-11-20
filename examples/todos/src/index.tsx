import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import App from './components/App'
import {reducer, OpticsAction} from '@myopia/optics'
import {State} from './types'

const store = createStore<State, OpticsAction<State>, void, void>(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
const element = document.getElementById('root')
if (!element) {
  throw new Error("couldn't find element with id root")
}
render(
  <Provider store={store}>
    <App />
  </Provider>,
  element
)
