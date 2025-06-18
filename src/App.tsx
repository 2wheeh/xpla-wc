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
