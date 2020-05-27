import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import {
  selectRates,
  selectCurrencies,
  selectBaseCurrency,
} from 'flux/modules/currencies';
import { createCurrencyPair } from 'helpers';

function Table(props) {
  const {
    rates,
    currencies,
    baseCurrency,
  } = props

  return (
    <table>
      <thead>
        <tr>
          <td>Time (UTC+3)</td>

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
  baseCurrency: T.string.isRequired,
}

const mapStateToProps = state => ({
  rates: selectRates(state),
  currencies: selectCurrencies(state),
  baseCurrency: selectBaseCurrency(state)
})

export default Table;