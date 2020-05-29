import React, { useRef, useState, useEffect } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { createChart } from 'lightweight-charts'

import {
  Colors,
  selectBaseCurrency,
  selectRatesByCurrencies,
} from 'flux/modules/currencies'
import {
  dayjs,
  CHART_TIME_FORMAT,
  createCurrencyPair,
} from 'helpers'

function initChart(rates, base, ref) {
  const chart = createChart(ref, {
    width: 800,
    height: 400,
    localization: {
      timeFormatter(businessDayOrTimestamp) {
        return dayjs
          .unix(businessDayOrTimestamp)
          .format(CHART_TIME_FORMAT)
      },
    },
  })

  const lines = new Map()
  rates.forEach((values, currency) => {
    const lineSeries = chart.addLineSeries({
      title: createCurrencyPair(currency, base),
      color: Colors[currency.toLowerCase()],
    })

    lineSeries.setData(values)
    lines.set(currency, lineSeries)
  })

  return { lines, chart }
}

function updateChart(rates, base, lines) {
  lines.forEach((line, currency) => {
    line.setData(rates.get(currency))
  })
}

function Chart(props) {
  const [chart, setChart] = useState(null)
  const [lines, setLines] = useState(null)
  const chartRoot = useRef(null)

  const { rates, base } = props

  useEffect(() => {
    if (!chart) {
      const {
        chart: newChart,
        lines: newLines,
      } = initChart(rates, base, chartRoot.current)

      setChart(newChart)
      setLines(newLines)
    }
  }, [rates, base, chart, setChart, setLines])

  useEffect(() => {
    if (lines) {
      updateChart(rates, base, lines)
    }
  }, [rates, base, lines])

  return <div ref={chartRoot} />
}

Chart.propTypes = {
  rates: T.shape({
    entries: T.func.isRequired,
  }).isRequired,
  base: T.string.isRequired,
}

const mapStateToProps = (state) => ({
  base: selectBaseCurrency(state),
  rates: selectRatesByCurrencies(state),
})

export default connect(mapStateToProps)(Chart)
