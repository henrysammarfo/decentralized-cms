import type { ComponentType, ReactNode } from 'react';
import type { LucideProps } from 'lucide-react';

// MDEditor types
declare module '@uiw/react-md-editor' {
  export interface MDEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    height?: number | string;
    preview?: 'edit' | 'preview' | 'live';
    visibleDragbar?: boolean;
    className?: string;
  }

  export interface MarkdownProps {
    source: string;
    className?: string;
  }

  export const MDEditor: ComponentType<MDEditorProps>;
  export const Markdown: ComponentType<MarkdownProps>;
}

// Lucide icons
declare module 'lucide-react' {
  export const Globe: ComponentType<LucideProps>;
  export const Pencil: ComponentType<LucideProps>;
  export const Trash2: ComponentType<LucideProps>;
  export const BarChart2: ComponentType<LucideProps>;
  export const UploadCloud: ComponentType<LucideProps>;
}

// @mysten/dapp-kit types
declare module '@mysten/dapp-kit' {
  import { ReactNode } from 'react';
  import { SuiClient } from '@mysten/sui'; // Updated import

  export interface NetworkConfig {
    [key: string]: { url: string };
  }

  export interface CreateNetworkConfigResult {
    networkConfig: NetworkConfig;
  }

  export interface SuiClientProviderProps {
    networks: NetworkConfig;
    defaultNetwork?: string;
    children: ReactNode;
  }

  export interface WalletProviderProps {
    children: ReactNode;
  }

  export const createNetworkConfig: (config: NetworkConfig) => CreateNetworkConfigResult;
  export const SuiClientProvider: ComponentType<SuiClientProviderProps>;
  export const WalletProvider: ComponentType<WalletProviderProps>;
  export const ConnectButton: ComponentType<{}>;
}

// @mysten/sui types (replacing @mysten/sui.js/client)
declare module '@mysten/sui' {
  export function getFullnodeUrl(network: 'testnet' | 'mainnet' | 'devnet' | 'localnet'): string;
}