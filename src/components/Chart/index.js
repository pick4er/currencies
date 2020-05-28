import React, { useRef, useEffect } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createChart } from 'lightweight-charts';

import {
  selectBaseCurrency,
  selectRatesByCurrencies,
} from 'flux/modules/currencies';
import { createCurrencyPair } from 'helpers';

const colors = {
  usd: '#005A9E',
  eur: '#FFB347',
}

function renderChart(rates, base, ref) {
  const chart = createChart(ref, {
    width: 400,
    height: 400
  })

  for (let [currency, values] of rates) {
    const lineSeries = chart.addLineSeries({
      title: createCurrencyPair(currency, base),
      color: colors[currency.toLowerCase()],
    })

    lineSeries.setData(values)
  }
}

function Chart(props) {
  const chartRoot = useRef(null)

  const { rates, base } = props;

  useEffect(() => {
    renderChart(rates, base, chartRoot.current)
  }, [rates, chartRoot, base])

  return (
    <div ref={chartRoot} />
  )
}

Chart.propTypes = {
  rates: T.shape({
    entries: T.func.isRequired,
  }).isRequired,
  base: T.string.isRequired,
}

const mapStateToProps = state => ({
  base: selectBaseCurrency(state),
  rates: selectRatesByCurrencies(state),
})

export default connect(mapStateToProps, null)(Chart);
