import { useState } from 'react';
import { Connect } from './Connect';
import { Send } from './Send';
import { Sign } from './Sign';
import { toAmount } from '@xpla.kitchen/utils';

const XPLA_DECIMALS = 18;

export function Wallet() {
  const [receiver, setReceiver] = useState('xpla1ek9fpjx5qrga6ajp0lk5akwm4s24twmzhc9725');
  const [input, setInput] = useState('0.1');

  const amount = toAmount(input, { decimals: XPLA_DECIMALS });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Connect />

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
      <Send receiver={receiver} amount={amount} />
      <Sign receiver={receiver} amount={amount} />
    </div>
  );
}
