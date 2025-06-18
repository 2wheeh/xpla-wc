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
