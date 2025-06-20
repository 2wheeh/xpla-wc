import { Connect } from './Connect';
import { Send } from './Send';
import { Sign } from './Sign';

export function Wallet() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Connect />
      <Send />
      <Sign />
    </div>
  );
}
