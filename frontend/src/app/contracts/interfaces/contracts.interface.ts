// Interfaces para los contratos de Solidity

export interface Location {
    location: string;
    timestamp: bigint;
    used: boolean;
}

export interface TokenData {
    description: string;
    locations: Location[];
    expiration: bigint;
}

export interface NetworkConfig {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
}

export interface ContractAddresses {
    traceDonation: string;
}

export interface WalletState {
    address: string | null;
    chainId: number | null;
    connected: boolean;
    isOwner: boolean;
    isAuthorizedONG: boolean;
}

export interface TransactionStatus {
    hash?: string;
    status: 'pending' | 'success' | 'error';
    message: string;
}
