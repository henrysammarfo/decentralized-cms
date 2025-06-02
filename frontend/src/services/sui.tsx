import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client'; // Updated import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

export const SuiProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <WalletProvider>{children}</WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);

export const connectWallet = async () => {
  // Implementation would use @mysten/dapp-kit hooks
  return { address: '0x...', status: 'connected' };
};

export const getCMSRegistry = async () => {
  // Implementation to interact with Move contract
  return { totalSites: 12, totalPages: 42 };
};

export const createSite = async (_name: string, _description: string) => {
  // Implementation to call Move contract
  console.log("Creating site:", _name, _description); // Added console for debugging
  return { siteId: '0x123...' };
};

export const addAuthor = async (_siteId: string, _authorAddress: string) => {
  // Implementation to call Move contract
  console.log("Adding author:", _siteId, _authorAddress); // Added console for debugging
  return { success: true };
};