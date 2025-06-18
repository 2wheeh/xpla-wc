import { ConnectType, useConnectedWallet, useWallet, WalletApp } from '@xpla/wallet-provider';

export function Wallet() {
  const { connect, disconnect } = useWallet();
  const wallet = useConnectedWallet();

  return (
    <div>
      {wallet ? (
        <div>
          <p>Connected to: {wallet.walletAddress}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => connect(ConnectType.WALLETCONNECT, undefined, WalletApp.XPLA_GAMES_NEW)}>
          Connect to XG
        </button>
      )}
    </div>
  );
}
