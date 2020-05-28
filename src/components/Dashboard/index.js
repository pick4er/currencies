import React, { useEffect } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Table from 'components/Table';
import Chart from 'components/Chart';
import ModeSwitcher from 'components/ModeSwitcher';

import { Modes, selectMode } from 'flux/modules/dashboard';
import {
  initDashboard as initDashboardAction
} from 'flux/modules/currencies';

import css from './index.module.scss';

function Dashboard(props) {
  const { mode, initDashboard } = props

  useEffect(() => {
    initDashboard()
  }, [initDashboard])

  return (
    <div>
      <ModeSwitcher />
      {mode === Modes.Table && <Table />}
      {mode === Modes.Chart && <Chart />}
    </div>
  )
}

Dashboard.propTypes = {
  mode: T.oneOf(Object.keys(Modes)).isRequired,
  initDashboard: T.func.isRequired,
}

const mapDispatchToProps = {
  initDashboard: initDashboardAction
}
const mapStateToProps = state => ({
  mode: selectMode(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);