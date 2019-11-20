import {connect} from 'react-redux'

import {setVisibilityFilter} from '../actions/visibilityFilter'
import Link from '../components/Link'

import {State, Dispatch} from '../types'
import {VisibilityFilter} from '../types/visibilityFilter'

type OwnProps = {
  filter: VisibilityFilter
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    active: state ? state.visibilityFilter === ownProps.filter : false
  }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Link)
