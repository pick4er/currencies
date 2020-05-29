import React from 'react'
import T from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'

import {
  Modes,
  selectMode,
  setMode as setModeAction,
} from 'flux/modules/dashboard'

import css from './index.module.scss'

function ModeSwitcher(props) {
  const { mode, setMode, className } = props

  const classNames = cx({
    [css.switcher]: true,
    [className]: className,
  })

  return (
    <ul className={classNames}>
      <li>
        <button
          type="button"
          onClick={() => setMode(Modes.Table)}
          disabled={mode === Modes.Table}
        >
          Table
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => setMode(Modes.Chart)}
          disabled={mode === Modes.Chart}
        >
          Chart
        </button>
      </li>
    </ul>
  )
}

ModeSwitcher.defaultProps = {
  className: '',
}

ModeSwitcher.propTypes = {
  className: T.string,
  setMode: T.func.isRequired,
  mode: T.oneOf(Object.values(Modes)).isRequired,
}

const mapStateToProps = (state) => ({
  mode: selectMode(state),
})
const mapDispatchToProps = {
  setMode: setModeAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeSwitcher)
