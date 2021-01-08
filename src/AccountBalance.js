import React, { useEffect, useState } from 'react';

import { useSubstrate } from './substrate-lib';
import { balanceToUnitNumber, numberToReadableString } from './numberUtils';
import './AccountBalance.css';

const moneyBase = 1000000000000;

const INIT_ACCOUNT_BALANCE = {
  borrowLimit: 0,
  supplyBalance: 0,
  debtBalance: 0,
  usedPercent: 0
};

export default function Main (props) {
  const { accountPair } = props;

  const [accountBalance, setAccountBalance] = useState(INIT_ACCOUNT_BALANCE);
  const [progressBarPercent, setProgressBarPercent] = useState(0);

  const { api } = useSubstrate();

  useEffect(() => {
    let unsubUser = null;

    if (accountPair) {
      const getAccountBalance = async () => {
        unsubUser = await api.query.lending.users(accountPair.address, userData => {
          if (userData.isSome) {
            const dataUnwrap = userData.unwrap();
            const borrowLimit = dataUnwrap.borrowLimit
              ? balanceToUnitNumber(dataUnwrap.borrowLimit) : 0;
            const supplyBalance = dataUnwrap.supplyBalance
              ? balanceToUnitNumber(dataUnwrap.supplyBalance) : 0;
            const debtBalance = dataUnwrap.debtBalance
              ? balanceToUnitNumber(dataUnwrap.debtBalance) : 0;
            let usedPercent = 0;
            if (borrowLimit !== 0) {
              usedPercent = (debtBalance / borrowLimit * 100).toFixed(2);
              setProgressBarPercent((debtBalance / borrowLimit * 100).toFixed(0));
            } else {
              setProgressBarPercent(0);
            }
            setAccountBalance({ borrowLimit, supplyBalance, debtBalance, usedPercent });
          } else {
            setAccountBalance(INIT_ACCOUNT_BALANCE);
          }
        });
      };
      getAccountBalance();
    }

    return () => unsubUser && unsubUser();
  }, [api.query.lending, accountPair]);

  const progressBarStyle = {
    width: progressBarPercent + '%'
  };
  const progressBarInvertStyle = {
    width: (100 - progressBarPercent) + '%'
  };

  return (
    <div>
      <div className="App-summary">
        <div className="App-summary-balance">
          <p className="App-summary-supply-balance-text">Supply Balance</p>
          <p className="App-summary-balance-number">
            ${numberToReadableString(accountBalance.supplyBalance)}
          </p>
        </div>
        <div className="App-summary-middle"></div>
        <div className="App-summary-balance">
          <p className="App-summary-borrow-balance-text">Borrow Balance</p>
          <p className="App-summary-balance-number">
            ${numberToReadableString(accountBalance.debtBalance)}
          </p>
        </div>
      </div>
      <div className="App-borrow-limit">
        <p className="App-borrow-limit-text">Borrow Limit</p>
        <p className="App-borrow-limit-percentage">{`${accountBalance.usedPercent}%`}</p>
        <div className="App-borrow-limit-bar">
          <div className="App-borrow-limit-bar-white" style={progressBarStyle}>
          </div>
          <div className="App-borrow-limit-bar-grey" style={progressBarInvertStyle}>
          </div>
        </div>
        <p className="App-borrow-limit-usd">
          ${numberToReadableString(accountBalance.borrowLimit)}
        </p>
      </div>
    </div>
  );
}
