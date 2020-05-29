import React from 'react'
import T from 'prop-types'
import dayjs from 'dayjs'
import cx from 'classnames'
import { connect } from 'react-redux'
import { FixedSizeList as List } from 'react-window'

import {
  selectCurrencies,
  selectBaseCurrency,
  selectRatesByTime,
} from 'flux/modules/currencies'
import {
  TIME_FORMAT,
  CHART_TIME_FORMAT,
  createCurrencyPair,
} from 'helpers'

import css from './index.module.scss'

function Table(props) {
  const { base, rates, currencies } = props

  return (
    <div className={css.table}>
      <div className={cx([css.header, css.row])}>
        <div>Time (UTC+3)</div>

        {currencies.map((currency) => (
          <div key={currency}>
            {createCurrencyPair(currency, base)}
          </div>
        ))}
      </div>
      <List
        width={416}
        height={500}
        itemSize={35}
        itemCount={rates.length}
        className={css.body}
      >
        {({ index, style }) => {
          const { time, ...prices } = rates[index]

          return (
            <div
              key={time}
              style={style}
              className={css.row}
            >
              <div>
                {dayjs(time, TIME_FORMAT).format(
                  CHART_TIME_FORMAT
                )}
              </div>

              {currencies.map((currency) => (
                <div key={time + currency}>
                  {prices[currency]}
                </div>
              ))}
            </div>
          )
        }}
      </List>
    </div>
  )
}

Table.propTypes = {
  rates: T.arrayOf(
    T.shape({
      time: T.string.isRequired,
      // currencies: string
    })
  ).isRequired,
  currencies: T.arrayOf(T.string).isRequired,
  base: T.string.isRequired,
}

const mapStateToProps = (state) => ({
  rates: selectRatesByTime(state),
  currencies: selectCurrencies(state),
  base: selectBaseCurrency(state),
})

export default connect(mapStateToProps)(Table)
