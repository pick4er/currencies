import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import {
  selectCurrencies,
  selectBaseCurrency,
  selectRatesByTime,
} from 'flux/modules/currencies';
import { createCurrencyPair } from 'helpers';

function Table(props) {
  const {
    base,
    rates,
    currencies,
  } = props

  return (
    <table>
      <thead>
        <tr>
          <td>Time (UTC+0)</td>

          {currencies.map(currency => (
            <td key={currency}>
              {createCurrencyPair(base, currency)}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {rates.map(({ time, ...prices }) => (
          <tr key={time}>
            <td>{ time }</td>

            {currencies.map(currency => (
              <td key={time + currency}>
                { prices[currency] }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

Table.propTypes = {
  rates: T.arrayOf(T.shape({
    time: T.string.isRequired,
    // currencies: string
  })),
  currencies: T.arrayOf(T.string).isRequired,
  base: T.string.isRequired,
}

const mapStateToProps = state => ({
  rates: selectRatesByTime(state),
  currencies: selectCurrencies(state),
  base: selectBaseCurrency(state)
})

export default connect(mapStateToProps)(Table);