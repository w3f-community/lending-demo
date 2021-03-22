import React, { useEffect, useState } from 'react';

import { InvitationDialog } from '../invitation';
import LiquidationAlert from '../LiquidationAlert';
import WelcomePage from '../WelcomePage';
import { useSubstrate } from '../substrate-lib';
import Dashboard from './Dashboard';
import Wallet from './Wallet';
import { WalletContextProvider } from './WalletContext';
import './DashboardPage.css';

export default function Main (props) {
  const { accountPair, accountBalance, setAccountAddress } = props;
  const { invitationActiveState } = useSubstrate();

  if (!accountPair || !accountPair.address) {
    return (
      <WelcomePage setAccountAddress={setAccountAddress} />
    );
  }

  if (invitationActiveState !== 'Activated') {
    return (
      <InvitationDialog />
    )
  }

  return (
    <WalletContextProvider>
      <div className="DashboardPage-container">
        <LiquidationAlert {...props} />
        <Dashboard
          accountPair={accountPair}
          accountBalance={accountBalance} />
        <Wallet accountPair={accountPair}/>
      </div>
    </WalletContextProvider>
  );
}
