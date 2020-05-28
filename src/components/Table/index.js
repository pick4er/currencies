import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import {
  selectCurrencies,
  selectBaseCurrency,
  selectRatesByTimestamp,
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
        {rates.map(({ timestamp, ...prices }) => (
          <tr key={timestamp}>
            <td>{ timestamp }</td>

            {currencies.map(currency => (
              <td key={timestamp + currency}>
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
    timestamp: T.string.isRequired,
    // currencies: string
  })),
  currencies: T.shape({
    entries: T.func.isRequired,
    values: T.func.isRequired,
  }).isRequired,
  base: T.string.isRequired,
}

const mapStateToProps = state => ({
  rates: selectRatesByTimestamp(state),
  currencies: selectCurrencies(state),
  base: selectBaseCurrency(state)
})

export default connect(mapStateToProps)(Table);