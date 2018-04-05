export const APP = "app";
export const DS = "/";
export const DRG_ISIN = "DR";
// Set connetions to production server
export const PROD = false;
// Set connetions to WebSocketSecure or HTTPs
export const WS = false;
// Address of the Parity registry of smart contracts
export const REGISTRY_KOVAN = '0xfAb104398BBefbd47752E7702D9fE23047E1Bca3';
// Address of RigoToken GRG
// export const GRG_ADDRESS_KV = "0x56B28058d303bc0475a34D439aa586307adAc1f5";

export const GRG = "GRG"
export const ETH = "ETH"

// Blockchain endpoint
export const EP_INFURA_KV = "https://kovan.infura.io/metamask"
export const EP_INFURA_RP = "https://ropsten.infura.io/metamask"
export const EP_INFURA_MN = "https://mainnet.infura.io/metamask"
export const EP_INFURA_KV_WS = "wss://kovan.infura.io/ws"
export const EP_INFURA_RP_WS = "wss://ropsten.infura.io/ws"
export const EP_INFURA_MN_WS = "wss://mainnet.infura.io/ws"

// Parity on ports 85xx
export const EP_RIGOBLOCK_KV_DEV = "https://srv03.endpoint.network:8545"
export const EP_RIGOBLOCK_KV_DEV_WS = "wss://srv03.endpoint.network:8546"
export const EP_RIGOBLOCK_KV_PROD = "https://kovan.endpoint.network:8545"
export const EP_RIGOBLOCK_KV_PROD_WS = "wss://kovan.endpoint.network:8546"

// Parity on ports 86xx
export const EP_RIGOBLOCK_RP_DEV = "https://srv03.endpoint.network:8645"
export const EP_RIGOBLOCK_RP_DEV_WS = "wss://srv03.endpoint.network:8646"
export const EP_RIGOBLOCK_RP_PROD = "https://ropsten.endpoint.network:8645"
export const EP_RIGOBLOCK_RP_PROD_WS = "wss://ropsten.endpoint.network:8646"

// Parity on ports 87xx
export const EP_RIGOBLOCK_MN_DEV = "https://srv03.endpoint.network:8745"
export const EP_RIGOBLOCK_MN_DEV_WS = "wss://srv03.endpoint.network:8746"
export const EP_RIGOBLOCK_MN_PROD = "https://mainnet.endpoint.network:8745"
export const EP_RIGOBLOCK_MN_PROD_WS = "wss://mainnet.endpoint.network:8746"

// Allowed endpoints in config section
export const INFURA = 'infura'
export const RIGOBLOCK = 'rigoblock'
export const LOCAL = 'local'
export const CUSTOM = 'custom'
export const ALLOWED_ENDPOINTS = [
  ['infura', false],
  ['rigoblock', false],
  ['local', false],
  ['custom', false],
]
export const PARITY_NETWORKS_ID = {
  kovan: 42,
  ropsten: 3,
  foundation: 1
}
export const DEFAULT_ENDPOINT = 'infura';
// Please refert to the following link for network IDs
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
// kovan = 42
export const DEFAULT_NETWORK_NAME = 'kovan';
export const DEFAULT_NETWORK_ID = 42;
export const DEFAULT_ETHERSCAN = "https://kovan.etherscan.io/"
export const NETWORK_OK = "networkOk"
export const NETWORK_WARNING = "networkWarning"

export const KOVAN = "kovan"
export const KOVAN_ID = 42
export const ROPSTEN = "ropsten"
export const ROPSTEN_ID = 3
export const MAINNET = "mainnet"
export const MAINNET_ID = 1

export const KOVAN_ETHERSCAN = "https://kovan.etherscan.io/"
export const ROPSTEN_ETHERSCAN = "https://ropsten.etherscan.io/"
export const MAINNET_ETHERSCAN = "https://etherscan.io"

export const ENDPOINTS = {
  infura: {
    name: "infura",
    https: {
      kovan: {
        dev: "https://kovan.infura.io/metamask",
        prod: "https://kovan.infura.io/metamask"
      },
      ropsten: {
        dev: "https://ropsten.infura.io/metamask",
        prod: "https://ropsten.infura.io/metamask"
      },
      mainnet: {
        dev: "https://mainnet.infura.io/metamask",
        prod: "https://mainnet.infura.io/metamask"
      },
    },
    wss: {
      kovan: {
        dev: "wss://kovan.infura.io/ws",
        prod: "wss://kovan.infura.io/ws"
      },
      ropsten: {
        dev: "wss://ropsten.infura.io/ws",
        prod: "wss://ropsten.infura.io/ws"
      },
      mainnet: {
        dev: "wss://mainnet.infura.io/ws",
        prod: "wss://mainnet.infura.io/ws"
      },
    }
  },
  rigoblock: {
    name: "rigoblock",
    https: {
      kovan: {
        dev: "https://srv03.endpoint.network:8545",
        prod: "https://kovan.endpoint.network:8545"
      },
      ropsten: {
        dev: "https://srv03.endpoint.network:8645",
        prod: "https://ropsten.endpoint.network:8645"
      },
      mainnet: {
        dev: "https://srv03.endpoint.network:8745",
        prod: "https://mainnet.endpoint.network:8745"
      },
    },
    wss: {
      kovan: {
        dev: "wss://srv03.endpoint.network:8546",
        prod: "wss://kovan.endpoint.network:8546"
      },
      ropsten: {
        dev: "wss://srv03.endpoint.network:8646",
        prod: "wss://ropsten.endpoint.network:8646"
      },
      mainnet: {
        dev: "wss://srv03.endpoint.network:8746",
        prod: "wss://mainnet.endpoint.network:8746"
      },
    }
  },
  local: {
    name: "local",
    https: {
      kovan: {
        dev: "http://localhost:8545",
        prod: "http://localhost:8545"
      },
      ropsten: {
        dev: "http://localhost:8545",
        prod: "http://localhost:8545"
      },
      mainnet: {
        dev: "http://localhost:8545",
        prod: "http://localhost:8545"
      },
    },
    wss: {
      kovan: {
        dev: "ws://localhost:8546",
        prod: "ws://localhost:8546"
      },
      ropsten: {
        dev: "ws://localhost:8546",
        prod: "ws://localhost:8546"
      },
      mainnet: {
        dev: "ws://localhost:8546",
        prod: "ws://localhost:8546"
      },
    }
  }, 
}

export const NETWORKS = {
  kovan: {
    id: 42,
    name: "kovan",
    etherscan: "https://kovan.etherscan.io/"
  },
  ropsten: {
    id: 3,
    name: "ropsten",
    etherscan: "https://ropsten.etherscan.io/"
  },
  mainnet: {
    id: 1,
    name: "mainnet",
    etherscan: "https://etherscan.io"
  }, 
}

// Default messages
export const MSG_NO_SUPPORTED_NETWORK = "We have detected that MetaMask is not connected to correct network."
export const MSG_NETWORK_STATUS_OK = "Service is operating normally."
export const MSG_NETWORK_STATUS_ERROR = "Service disruption. Cannot update accounts balances. Account balances could be out of date."

// Redux actions
// Interface
export const ATTACH_INTERFACE = 'ATTACH_INTERFACE'
export const UPDATE_INTERFACE = 'UPDATE_INTERFACE'
export const ATTACH_INTERFACE_PENDING = 'ATTACH_INTERFACE_PENDING'
export const ATTACH_INTERFACE_FULFILLED = 'ATTACH_INTERFACE_FULFILLED'
export const ATTACH_INTERFACE_REJECTED = 'ATTACH_INTERFACE_REJECTED'

// User
export const IS_MANAGER = 'IS_MANAGER'

// Transactions
export const ADD_TRANSACTION = 'ADD_TRANSACTION'
export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS'

// Eventful
export const UPDATE_TRANSACTIONS_DRAGO_HOLDER = 'UPDATE_TRANSACTIONS_DRAGO_HOLDER'
export const UPDATE_TRANSACTIONS_DRAGO_MANAGER = 'UPDATE_TRANSACTIONS_DRAGO_MANAGER'
export const UPDATE_TRANSACTIONS_VAULT_HOLDER = 'UPDATE_TRANSACTIONS_VAULT_HOLDER'
export const UPDATE_TRANSACTIONS_VAULT_MANAGER = 'UPDATE_TRANSACTIONS_VAULT_MANAGER'

