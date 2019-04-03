import React from 'react'
import PropTypes from 'prop-types'
import {requestTimeout, clearRequestTimeout} from '@render-props/utils'


class Delayed extends React.Component {
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
    this.cxt = {cancel: this.cancel}
  }

  componentDidMount () {
    this.setDelayTimeout(this.props)
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
    const {eachUpdate, by, children, ...props} = this.props
    return this.state.shouldDisplay && React.createElement(
      children,
      Object.assign(props, this.cxt)
    )
  }
}

export default Component => props => <Delayed children={Component} {...props}/>
