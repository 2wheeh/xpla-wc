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
