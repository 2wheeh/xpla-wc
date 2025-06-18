import { ConnectType, useConnectedWallet, useWallet, WalletApp } from '@xpla/wallet-provider';

export function Connect() {
  const { connect, disconnect } = useWallet();
  const wallet = useConnectedWallet();

  if (!wallet)
    return (
      <button
        onClick={() =>
          connect(
            ConnectType.WALLETCONNECT, // This enables skipping the connection type selection screen
            undefined, // This is for extension wallets; we don't need it for WalletConnect
            WalletApp.XPLA_GAMES_NEW // This enables to use deeplink for new XPLA GAMES Wallet
          )
        }
      >
        Connect
      </button>
    );

  return (
    <>
      <h3>Connected to: {wallet.walletAddress}</h3>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
}
