export const FUND_PROXY_ADDRESS = '0x2be8947eb6b9b1437d83d70c826996540c3adb57'

export const RB_0X_EXCHANGE_ADDRESS_KV =
  '0xf307de6528fa16473d8f6509b7b1d8851320dba5' // NEW EXCHANGE

export const RB_TOKEN_TRANSFER_PROXY_ADDRESS_KV =
  '0xcc040edf6e508c4372a62b1a902c69dcc52ceb1d'

export const RB_EFX_EXCHANGE_ADDRESS_RP =
  '0x8965a813fb43a141d7741320cd16cc1898af97fb'
export const RB_EFX_TOKEN_TRANSFER_PROXY_ADDRESS_RP =
  '0x567c68a23cf5066973d2c3D7e3Daf3405e2ea9E4'

export const GRG = 'GRG'
export const ETH = 'ETH'

export const ETHERSCAN_KOVAN = 'https://kovan.etherscan.io'

// Blockchain endpoint
export const EP_INFURA_KV = 'https://kovan.infura.io/metamask'
export const EP_INFURA_RP = 'https://ropsten.infura.io/metamask'
export const EP_INFURA_MN = 'https://mainnet.infura.io/metamask'
export const EP_INFURA_KV_WS = 'wss://kovan.infura.io/ws'
export const EP_INFURA_RP_WS = 'wss://ropsten.infura.io/ws'
export const EP_INFURA_MN_WS = 'wss://mainnet.infura.io/ws'

// Parity - Kovan
export const EP_RIGOBLOCK_KV_DEV = 'https://kovan.dev.endpoint.network/rpc'
export const EP_RIGOBLOCK_KV_DEV_WS = 'wss://kovan.dev.endpoint.network/ws'
export const EP_RIGOBLOCK_KV_PROD = 'https://kovan..dev.endpoint.network/rpc'
export const EP_RIGOBLOCK_KV_PROD_WS = 'wss://kovan.dev.endpoint.network/ws'

// Parity - Ropsten
export const EP_RIGOBLOCK_RP_DEV = 'https://ropsten.dev.endpoint.network/rpc'
export const EP_RIGOBLOCK_RP_DEV_WS = 'wss://ropsten.dev.endpoint.network/ws'
export const EP_RIGOBLOCK_RP_PROD = 'https://ropsten.dev.endpoint.network/rpc'
export const EP_RIGOBLOCK_RP_PROD_WS = 'wss://ropsten.dev.endpoint.network/ws'

// Parity on ports 87xx
export const EP_RIGOBLOCK_MN_DEV = 'https://srv03.endpoint.network:8745'
export const EP_RIGOBLOCK_MN_DEV_WS = 'wss://srv03.endpoint.network:8746'
export const EP_RIGOBLOCK_MN_PROD = 'https://mainnet.endpoint.network:8745'
export const EP_RIGOBLOCK_MN_PROD_WS = 'wss://mainnet.endpoint.network:8746'

// Allowed endpoints in config section
export const INFURA = 'infura'
export const RIGOBLOCK = 'rigoblock'
export const LOCAL = 'local'
export const CUSTOM = 'custom'

export const DRAGO_FACTORY_KOVAN_ADDRESS =
  '0x5b67f29f6d50f475d56ace03ce4b0d6a1287dc1f'
export const DRAGO_REGISTRY_KOVAN_ADDRESS =
  '0x80673d1201c5e61e1efdd4e06bef015d1293ccee'

export const DRAGO_FACTORY_ROPSTEN_ADDRESS =
  '0x8c35a5daf283e9ece4c968899eed028859645a8f'
export const DRAGO_REGISTRY_ROPSTEN_ADDRESS =
  '0x82f137b817ab61cdb2af5f23d5b96094b5fe5f7d'

export const contracts = {
  3: {
    dragoFactory: DRAGO_FACTORY_ROPSTEN_ADDRESS,
    dragoRegistry: DRAGO_REGISTRY_ROPSTEN_ADDRESS
  },
  42: {
    dragoFactory: DRAGO_FACTORY_KOVAN_ADDRESS,
    dragoRegistry: DRAGO_REGISTRY_KOVAN_ADDRESS
  }
}

export const networkInfo = {
  3: {
    id: 3,
    name: 'ropsten'
  },
  42: {
    id: 42,
    name: 'kovan'
  }
}

export const tokensEthfinex = {
  3: {
    ZRX: {
      symbol: 'ZRX',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'ZRX'
      },
      address: '0xA8E9Fa8f91e5Ae138C74648c9C304F1C75003A8D',
      decimals: 18,
      name: '0x Protocol Token',
      wrappers: {
        Ethfinex: {
          symbol: 'ZRXW',
          decimals: 18,
          address: '0xFF32E76EAdc11Fc816A727980E92805D237CDB28',
          name: 'ZRX Wrapper'
        }
      }
    },
    ETH: {
      symbol: 'ETH',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'ETH'
      },
      address: '0x0',
      decimals: 18,
      name: 'Ether',
      wrappers: {
        Ethfinex: {
          symbol: 'ETHW',
          decimals: 18,
          address: '0x965808e7F815CfffD4c018ef2Ba4C5A65EBa087e',
          name: 'ETH Wrapper'
        }
      }
    },
    USDT: {
      symbol: 'USDT',
      isOldERC20: true,
      symbolTicker: {
        Ethfinex: 'USD'
      },
      address: '0x0736d0c130b2eAD47476cC262dbed90D7C4eeABD',
      decimals: 6,
      name: 'Tether USD',
      wrappers: {
        Ethfinex: {
          symbol: 'USDTW',
          decimals: 6,
          address: '0x83E42e6d1ac009285376340ef64BaC1C7d106C89',
          name: 'USDT Wrapper'
        }
      }
    },
    GRG: {
      symbol: 'GRG',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'GRG'
      },
      address: '0x6FA8590920c5966713b1a86916f7b0419411e474',
      decimals: 18,
      name: 'GRG Token',
      wrappers: {
        Ethfinex: {
          symbol: 'GRGW',
          decimals: 18,
          address: '0x5959f2036608d693B4d085020ACAdBBf664C793E',
          name: 'GRG Wrapper'
        }
      }
    }
  }
}

// FIRST DEPLOYMENT
//

// export const tokensRigoblockEthfinex = {
//   3: {
//     ETH: {
//       symbol: 'ETH',
//       isOldERC20: false,
//       symbolTicker: {
//         Ethfinex: 'ETH'
//       },
//       address: '0x0',
//       decimals: 18,
//       name: 'Ether',
//       wrappers: {
//         Ethfinex: {
//           symbol: 'ETHW',
//           decimals: 18,
//           address: '0x31ac2a9c844862696dda952999c4e2c399cf0f2c',
//           name: 'ETH Wrapper'
//         }
//       }
//     },
//     GRG: {
//       symbol: 'GRG',
//       isOldERC20: false,
//       symbolTicker: {
//         Ethfinex: 'GRG'
//       },
//       address: '0x6FA8590920c5966713b1a86916f7b0419411e474',
//       decimals: 18,
//       name: 'GRG Token',
//       wrappers: {
//         Ethfinex: {
//           symbol: 'GRGW',
//           decimals: 18,
//           address: '0x1069b83bd0900211adf86a752abd16b4a2b4d68d',
//           name: 'GRG Wrapper'
//         }
//       }
//     }
//   }
// }

// SECOND DEPLOYMENT
//

export const tokensRigoblockEthfinex = {
  3: {
    ETH: {
      symbol: 'ETH',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'ETH'
      },
      address: '0x0',
      decimals: 18,
      name: 'Ether',
      wrappers: {
        Ethfinex: {
          symbol: 'ETHW',
          decimals: 18,
          address: '0x06da2eb72279c1cec53c251bbff4a06fbfb93a5b',
          name: 'ETH Wrapper'
        }
      }
    },
    GRG: {
      symbol: 'GRG',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'GRG'
      },
      address: '0x6FA8590920c5966713b1a86916f7b0419411e474',
      decimals: 18,
      name: 'GRG Token',
      wrappers: {
        Ethfinex: {
          symbol: 'GRGW',
          decimals: 18,
          address: '0xacfb4c79259e3c2c1bf054f136e6d75f7cc2b07e',
          name: 'GRG Wrapper'
        }
      }
    }
  }
}

export const exchanges = {
  3: {
    ZeroEx: {
      networkId: 3,
      needLocking: false,
      needAllowance: true,
      name: 'ZeroEx',
      exchangeContractAddress: '0x479cc461fecd078f766ecc58533d6f69580cf3ac',
      tokenTransferProxyContractAddress:
        '0xa8e9fa8f91e5ae138c74648c9c304f1c75003a8d',
      tradedTokens: {}
    },
    // RigoBlockEthfinex: {
    //   needLocking: true,
    //   needAllowance: false,
    //   exchangeContractAddress: '0x8965a813fb43a141d7741320cd16cc1898af97fb',
    //   networkId: 3,
    //   name: 'RigoBlockEthfinex',
    //   tokenTransferProxyContractAddress:
    //     '0x567c68a23cf5066973d2c3D7e3Daf3405e2ea9E4',
    //   tradedTokens: tokensRigoblockEthfinex
    // },
    RigoBlockEthfinex: {
      needLocking: true,
      needAllowance: false,
      exchangeContractAddress: '0x1d8643aae25841322ecde826862a9fa922770981',
      networkId: 3,
      name: 'RigoBlockEthfinex',
      tokenTransferProxyContractAddress:
        '0xEEA64EeBd1F2Dc273cfC79CbDda23b69C6b5588D',
      tradedTokens: tokensRigoblockEthfinex
    },
    Ethfinex: {
      needLocking: true,
      needAllowance: false,
      exchangeContractAddress: '0x67799a5e640bc64ca24d3e6813842754e546d7b1',
      networkId: 3,
      name: 'Ethfinex',
      tokenTransferProxyContractAddress:
        '0x67799a5e640bc64ca24d3e6813842754e546d7b1',
      tradedTokens: tokensEthfinex
    }
  },
  42: {
    ZeroEx: {
      needLocking: false,
      needAllowance: true,
      exchangeContractAddress: '0x90Fe2Af704B34E0224bF2299C838E04d4Dcf1364',
      networkId: 42,
      name: 'ZeroEx',
      tokenTransferProxyContractAddress:
        '0x087Eed4Bc1ee3DE49BeFbd66C662B434B15d49d4',
      tradedTokens: {}
    },
    RigoBlockZeroX: {
      needLocking: false,
      needAllowance: true,
      exchangeContractAddress: RB_0X_EXCHANGE_ADDRESS_KV,
      networkId: 42,
      name: 'RigoBlockZeroX',
      tokenTransferProxyContractAddress: RB_TOKEN_TRANSFER_PROXY_ADDRESS_KV,
      tradedTokens: {}
    }
  }
}
