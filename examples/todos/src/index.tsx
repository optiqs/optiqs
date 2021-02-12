import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, compose, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import App from './components/App'
import {reducer, OptiqsAction, updateState} from '@optiqs/optiqs'
import {State} from './types'
import {all} from '@redux-saga/core/effects'
import {todoSagas} from './actions/todos'
import {visibilityFilterSagas} from './actions/visibilityFilter'

function* sagas() {
  yield all([...todoSagas, ...visibilityFilterSagas])
}

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))

const store = createStore<State, OptiqsAction<State>, void, void>(
  reducer,
  enhancer
)

store.dispatch(
  updateState<State>(_ => ({todos: [], visibilityFilter: 'SHOW_ALL'}))
)

sagaMiddleware.run(sagas)

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
