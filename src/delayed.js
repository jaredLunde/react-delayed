import React from 'react'
import PropTypes from 'prop-types'
import {requestTimeout, clearRequestTimeout} from '@render-props/utils'


export default Component => class delayed extends React.Component {
  static propTypes = {
    by: PropTypes.number.isRequired,
    eachUpdate: PropTypes.bool
  }

  static defaultProps = {
    by: 200
  }

  state = {shouldDisplay: null}
  timeout = null

  constructor (props) {
    super(props)
    this.setDelayTimeout(props)
  }

  componentDidUpdate () {
    if (this.props.eachUpdate) {
      this.setState({shouldDisplay: false})
      this.setDelayTimeout(this.props)
    }
  }

  componentWillUnmount () {
    this.cancel()
  }

  cancel = () => {
    if (this.timeout !== null) {
      clearRequestTimeout(this.timeout)
      this.timeout = null
    }
  }

  setDelayTimeout = ({by}) => {
    this.cancel()

    if (by !== -1 && by !== Infinity) {
      this.timeout = requestTimeout(() => this.setState({shouldDisplay: true}), by)
    }
  }

  render () {
    const {eachUpdate, by, ...props} = this.props
    return this.state.shouldDisplay && Component({cancel: this.cancel, ...props})
  }
}
