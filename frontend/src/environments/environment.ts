export const environment = {
    production: false,
    contracts: {
        // TODO: Actualizar con las direcciones reales después del despliegue
        traceDonation: '0x319b1BC2a3f3120e10C2Aa11f7a1Bd38e070f5E6',
        donationItem: '0x22d444E891048725F7aa8DC466c4157C4A5d8603',
    },
    network: {
        chainId: 11155111, // Sepolia Testnet
        name: 'Sepolia Testnet',
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        blockExplorer: 'https://sepolia.etherscan.io'
    }
};
