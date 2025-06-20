## Getting Started

New XPLA GAMES Wallet has released - [Download](https://xpla.games/download_new)

This is a simple example of how to integrate XPLA GAMES Wallet via WalletConnect using `@xpla/wallet-provider`.

### Install

Scaffold a React App using Vite:

```bash
pnpm create vite my-dapp
```

Install dependencies to your React App.
You need `@xpla/wallet-provider`, `@xpla/wallet-controller` version 1.7.2 or later:

```bash
pnpm install @xpla/xpla.js @xpla/wallet-provider @xpla/wallet-controller @xpla.kitchen/utils @tanstack/react-query

```

Polyfill `Buffer` for `@xpla/wallet-provider` to work:

```bash
pnpm install -D vite-plugin-node-polyfills
```

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer'],
    }),
  ],
});
```

if you are not using Vite, you should install `buffer` package and import it in your entry file:

```bash
pnpm install buffer
```

```ts
// main.tsx

import { Buffer } from 'buffer';
window.Buffer = Buffer;
```

### Provider

Create a provider to wrap your app:

```tsx
// App.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from './WalletProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <div>Hello</div>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
```

```tsx
// WalletProvider.tsx

import { useQuery } from '@tanstack/react-query';
import { getChainOptions } from '@xpla/wallet-controller';
import { WalletProvider as XplaWalletProvider } from '@xpla/wallet-provider';
import type { PropsWithChildren } from 'react';

export function WalletProvider({ children }: PropsWithChildren) {
  const { data: chainOptions } = useQuery({
    queryKey: ['chainOptions'],
    queryFn: getChainOptions,
  });

  return chainOptions && <XplaWalletProvider {...chainOptions}>{children}</XplaWalletProvider>;
}
```

`getChainOptions` returns the chain options such as chain ID, RPC URL, and REST URL for the XPLA networks. It is used to configure the wallet provider.

Now, we can use `useWallet` from `@xpla/wallet-provider` to interacts with the wallet in components.
Let's create a simple Wallet component that interacts to with XPLA GAMES Wallet via WalletConnect:

### Connect

```tsx
// Connect.tsx
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
            WalletApp.XPLA_GAMES_NEW // This enables the use of deeplink for the new XPLA GAMES Wallet
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
```

`connect()` accepts 3 parameters:

1. `type`: The type of connection, such as `WALLETCONNECT` or `EXTENSION`.
2. `identifier`: This is used for extension wallets to identify the wallet. For WalletConnect, you can pass `undefined`.
3. `walletApp`: This specifies the wallet app to connect to. For the new XPLA GAMES Wallet, use `WalletApp.XPLA_GAMES_NEW`.

### Send

```tsx
// Send.tsx
import { toAmount } from '@xpla.kitchen/utils';
import { useConnectedWallet, useWallet, type TxResult } from '@xpla/wallet-provider';
import { MsgSend } from '@xpla/xpla.js';
import { useState } from 'react';

const XPLA_DENOM = 'axpla';
const XPLA_DECIMALS = 18;

export function Send() {
  const { post } = useWallet();
  const wallet = useConnectedWallet();

  const [receiver, setReceiver] = useState('xpla1ek9fpjx5qrga6ajp0lk5akwm4s24twmzhc9725');
  const [input, setInput] = useState('0.1');
  const [txResult, setTxResult] = useState<TxResult | null>(null);

  const send = async () => {
    if (!wallet) return;

    try {
      const msg = new MsgSend(wallet.walletAddress, receiver, {
        [XPLA_DENOM]: toAmount(input, { decimals: XPLA_DECIMALS }),
      });

      const res = await post({ msgs: [msg] });
      setTxResult(res);
    } catch (e) {
      console.error('Send error:', e);
    }
  };

  return (
    <>
      <div>
        <label htmlFor='receiver'>Receiver Address</label>
        <input
          style={{ width: '100%' }}
          id='receiver'
          value={receiver}
          onChange={e => setReceiver(e.target.value)}
          placeholder='Receiver Address'
        />
      </div>

      <div>
        <label htmlFor='amount'>Amount (XPLA)</label>
        <input
          style={{ width: '100%' }}
          id='amount'
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Amount'
        />
      </div>

      <button onClick={send} disabled={!wallet}>
        {wallet ? 'Send' : 'Connect Wallet First'}
      </button>

      {txResult && (
        <div>
          <h3>Transaction Result</h3>
          <pre>{JSON.stringify(txResult, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
```

You can use `MsgSend` to transfer $XPLA coins. It requires the sender's address, receiver's address, and the amount to send.
The type of amount is object with the denomination as the key and the amount as the value.

There is a handy utility function `toAmount()` from `@xpla.kitchen/utils` to convert the amount to the correct format based on the decimals.

```tsx
const msg = new MsgSend(wallet.walletAddress, receiver, {
  [XPLA_DENOM]: toAmount(input, { decimals: XPLA_DECIMALS }),
});
```

`post()` method triggers wallet to sign and broadcast the transaction.

```tsx
const res = await post({ msgs: [msg] });
```

Let's combine `Connect` and `Send` into `Wallet`.

```tsx
// Wallet.tsx

import { Connect } from './Connect';
import { Send } from './Send';

export function Wallet() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Connect />
      <Send />
    </div>
  );
}
```

```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from './WalletProvider';
import { Wallet } from './Wallet';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Wallet />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
```
