import { CryptoPair } from './types';

export const CRYPTOCOMPARE_API_KEY = '8a639309466b93ee7cbfafaae16279eb22cffe30d1c68a25d0047d2a77d43ab2';
export const CRYPTOCOMPARE_API_BASE = 'https://min-api.cryptocompare.com/data/v2';

export const SUPPORTED_PAIRS: CryptoPair[] = [
  { symbol: 'BTC/USD', base: 'BTC', quote: 'USD', name: 'Bitcoin', type: 'CRYPTO' },
  { symbol: 'ETH/USD', base: 'ETH', quote: 'USD', name: 'Ethereum', type: 'CRYPTO' },
  { symbol: 'XRP/USD', base: 'XRP', quote: 'USD', name: 'Ripple', type: 'CRYPTO' },
  { symbol: 'BNB/USD', base: 'BNB', quote: 'USD', name: 'Binance Coin', type: 'CRYPTO' },
  { symbol: 'SOL/USD', base: 'SOL', quote: 'USD', name: 'Solana', type: 'CRYPTO' },
  { symbol: 'ADA/USD', base: 'ADA', quote: 'USD', name: 'Cardano', type: 'CRYPTO' },
  { symbol: 'DOGE/USD', base: 'DOGE', quote: 'USD', name: 'Dogecoin', type: 'CRYPTO' },
  { symbol: 'AVAX/USD', base: 'AVAX', quote: 'USD', name: 'Avalanche', type: 'CRYPTO' },
  { symbol: 'LINK/USD', base: 'LINK', quote: 'USD', name: 'Chainlink', type: 'CRYPTO' },
  { symbol: 'DOT/USD', base: 'DOT', quote: 'USD', name: 'Polkadot', type: 'CRYPTO' },
  { symbol: 'MATIC/USD', base: 'MATIC', quote: 'USD', name: 'Polygon', type: 'CRYPTO' },
  { symbol: 'TRX/USD', base: 'TRX', quote: 'USD', name: 'Tron', type: 'CRYPTO' },
  { symbol: 'LTC/USD', base: 'LTC', quote: 'USD', name: 'Litecoin', type: 'CRYPTO' },
  { symbol: 'HBAR/USD', base: 'HBAR', quote: 'USD', name: 'Hedera', type: 'CRYPTO' },
  { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', name: 'Euro', type: 'FOREX' },
  { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', name: 'British Pound', type: 'FOREX' },
  { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', name: 'Aus Dollar', type: 'FOREX' },
];

export const TIMEFRAMES = [
  { label: 'Scalp (1m)', value: '1m', limit: 200, apiValue: 'histominute', aggregate: 1 },
  { label: 'Scalp (5m)', value: '5m', limit: 200, apiValue: 'histominute', aggregate: 5 },
  { label: 'Intraday (15m)', value: '15m', limit: 200, apiValue: 'histominute', aggregate: 15 },
  { label: 'Intraday (1h)', value: '1h', limit: 200, apiValue: 'histohour', aggregate: 1 },
  { label: 'Swing (4h)', value: '4h', limit: 200, apiValue: 'histohour', aggregate: 4 },
  { label: 'Swing (1d)', value: '1d', limit: 200, apiValue: 'histoday', aggregate: 1 },
];

export const INITIAL_CREDITS = 3;
export const COST_PER_ANALYSIS = 1;