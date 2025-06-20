import { useConnectedWallet, useWallet, type TxResult } from '@xpla/wallet-provider';
import { MsgSend } from '@xpla/xpla.js';
import { useState } from 'react';

const XPLA_DENOM = 'axpla';

export function Send({ receiver, amount }: { receiver: string; amount: string }) {
  const { post } = useWallet();
  const wallet = useConnectedWallet();

  const [txResult, setTxResult] = useState<TxResult | null>(null);

  const send = async () => {
    if (!wallet) return;

    try {
      const msg = new MsgSend(wallet.walletAddress, receiver, {
        [XPLA_DENOM]: amount,
      });

      const res = await post({ msgs: [msg] });
      setTxResult(res);
    } catch (e) {
      console.error('Send error:', e);
    }
  };

  return (
    <>
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
