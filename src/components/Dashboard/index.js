import React, { useEffect } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'

import Table from 'components/Table'
import Chart from 'components/Chart'
import ModeSwitcher from 'components/ModeSwitcher'

import { Modes, selectMode } from 'flux/modules/dashboard'
import {
  initRates as initRatesAction,
  pingRates as pingRatesAction,
} from 'flux/modules/currencies'

import css from './index.module.scss'

function Dashboard(props) {
  const { mode, initRates, pingRates } = props

  useEffect(() => {
    initRates()
    pingRates()
  }, [initRates, pingRates])

  return (
    <div className={css.dashboard}>
      <ModeSwitcher className={css.switcher} />
      {mode === Modes.Table && <Table />}
      {mode === Modes.Chart && <Chart />}
    </div>
  )
}

Dashboard.propTypes = {
  mode: T.oneOf(Object.values(Modes)).isRequired,
  initRates: T.func.isRequired,
  pingRates: T.func.isRequired,
}

const mapDispatchToProps = {
  initRates: initRatesAction,
  pingRates: pingRatesAction,
}
const mapStateToProps = (state) => ({
  mode: selectMode(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
