// TypeScript Definitions for Forecast Engine Enterprise Frontend

export type HorizonConfidence = 'high' | 'medium' | 'low' | 'very_low';

export interface ForecastPoint {
  date: string;
  predictedSales: number;
  confidence: HorizonConfidence;
  lowerBound?: number;
  upperBound?: number;
}

export interface ForecastResponse {
  productId: string;
  storeId: string;
  horizon: number;
  forecast: ForecastPoint[];
}

export interface BackendHealth {
  status: string;
  model_loaded: boolean;
  series_indexed: number;
  horizons: number[];
}

export type AlertTier = 'CRITICAL' | 'WARNING' | 'OK' | 'OVERSTOCK';

export interface InventoryItem {
  id: string;
  productId: string;
  storeId: string;
  name: string;
  category: 'FOODS' | 'HOUSEHOLD' | 'HOBBIES';
  deptId: string;
  currentStock: number;
  maxStock: number;
  leadTimeDays: number;
  unitPrice: number;
  lastMonthSales: number;
  forecastDemandMonth1: number;
  leadTimeDemand: number;
  rop: number;
  safetyStock: number;
  status: AlertTier;
  recommendedOrder: number;
  orderCalculationExplanation: string;
  triggeredAction: string;
}

export interface HorizonBenchmark {
  horizon: number;
  targetMonth: string;
  rawWape: number;
  correctionFactor: number;
  calibratedWape: number;
  naiveMovingAverageWape: number;
}

export interface StoreMetadata {
  id: string;
  name: string;
  state: 'CA' | 'TX' | 'WI';
  cluster: string;
  hubTransitHours: number;
  leadTimeDays: number;
}
