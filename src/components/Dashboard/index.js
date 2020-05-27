import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Table from 'components/Table';
import Chart from 'components/Chart';
import ModeSwitcher from 'components/ModeSwitcher';

import { Modes, selectMode } from 'flux/modules/dashboard';

import css from './index.module.scss';

function Dashboard(props) {
  const { mode } = props

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
}

const mapStateToProps = state => ({
  mode: selectMode(state),
})

export default connect(
  mapStateToProps,
  null
)(Dashboard);