import { useConnectedWallet, type SignResult } from '@xpla/wallet-provider';
import { MsgExecuteContract, SignMode, type CreateTxOptions } from '@xpla/xpla.js';
import { useState } from 'react';

const cw20Contract = 'xpla1xljvdrtyn86kv7hrdhae4qxdy8krajah3w7xhtyrt0n69und9xdqdhrasc'; // Replace it with the address of the CW20 token created in example-4.js.

export function Sign({ receiver, amount }: { receiver: string; amount: string }) {
  const wallet = useConnectedWallet();
  const [signed, setSigned] = useState<SignResult | null>(null);
  const sign = async () => {
    if (!wallet) {
      return;
    }

    const transferMsg = new MsgExecuteContract(wallet.walletAddress, cw20Contract, {
      transfer: {
        recipient: receiver,
        amount,
      },
    });

    const createTxOptions = {
      memo: '',
      msgs: [transferMsg],
    } satisfies CreateTxOptions;

    const res = await wallet.sign({ ...createTxOptions, signMode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON });
    setSigned(res);
  };

  return (
    <>
      <button onClick={sign} disabled={!wallet}>
        {wallet ? 'Sign' : 'Connect Wallet First'}
      </button>
      {signed && (
        <div>
          <h2>Signed Result</h2>
          <pre>{JSON.stringify(signed, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
