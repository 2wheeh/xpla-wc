import { toAmount } from '@xpla.kitchen/utils';
import { useConnectedWallet, useWallet, type TxResult } from '@xpla/wallet-provider';
import { Coin, MsgSend, Numeric } from '@xpla/xpla.js';
import { useState } from 'react';

const XPLA_DENOM = 'axpla';
const XPLA_DECIMALS = 18;

export function Send() {
  const { post } = useWallet();
  const wallet = useConnectedWallet();

  const [receiver, setReceiver] = useState('xpla1ek9fpjx5qrga6ajp0lk5akwm4s24twmzhc9725');
  const [amount, setAmount] = useState('0.1');
  const [txResult, setTxResult] = useState<TxResult | null>(null);

  const send = async () => {
    if (!wallet) return;

    try {
      const msg = new MsgSend(wallet.walletAddress, receiver, [
        new Coin(XPLA_DENOM, toAmount(Numeric.parse(amount).toString(), { decimals: XPLA_DECIMALS })),
      ]);

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
          value={amount}
          onChange={e => setAmount(e.target.value)}
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
