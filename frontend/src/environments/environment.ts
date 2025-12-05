export const environment = {
    production: false,
    contracts: {
        // TODO: Actualizar con las direcciones reales después del despliegue
        traceDonation: '0x11Fd83630039dBA6d4a100b7F3329339ACfBAFDe',
        donationItem: '0x6B9d14Cc30b3F3FB8619F7FbB8aaD05aB588Fb01',
    },
    network: {
        chainId: 11155111, // Sepolia Testnet
        name: 'Sepolia Testnet',
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        blockExplorer: 'https://sepolia.etherscan.io'
    }
};
