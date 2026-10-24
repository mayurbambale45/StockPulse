import type {
  ForecastResponse,
  BackendHealth,
  InventoryItem,
  AlertTier,
  HorizonBenchmark,
  StoreMetadata,
} from '../types';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const STORES: StoreMetadata[] = [
  { id: 'CA_1', name: 'Supercenter #1042 (Los Angeles)', state: 'CA', cluster: 'California Central', hubTransitHours: 24, leadTimeDays: 7 },
  { id: 'CA_2', name: 'Supercenter #1105 (San Diego)', state: 'CA', cluster: 'California South', hubTransitHours: 28, leadTimeDays: 8 },
  { id: 'CA_3', name: 'Supercenter #1219 (San Jose)', state: 'CA', cluster: 'California Bay Area', hubTransitHours: 26, leadTimeDays: 7 },
  { id: 'CA_4', name: 'Supercenter #1390 (Sacramento)', state: 'CA', cluster: 'California North', hubTransitHours: 32, leadTimeDays: 9 },
  { id: 'TX_1', name: 'Supercenter #2001 (Houston Metro)', state: 'TX', cluster: 'Texas Gulf', hubTransitHours: 22, leadTimeDays: 6 },
  { id: 'TX_2', name: 'Supercenter #2140 (Dallas-Fort Worth)', state: 'TX', cluster: 'Texas North', hubTransitHours: 20, leadTimeDays: 6 },
  { id: 'TX_3', name: 'Supercenter #2280 (Austin-San Antonio)', state: 'TX', cluster: 'Texas Central', hubTransitHours: 24, leadTimeDays: 7 },
  { id: 'WI_1', name: 'Supercenter #3005 (Milwaukee Metro)', state: 'WI', cluster: 'Wisconsin East', hubTransitHours: 30, leadTimeDays: 8 },
  { id: 'WI_2', name: 'Supercenter #3112 (Madison Regional)', state: 'WI', cluster: 'Wisconsin Central', hubTransitHours: 32, leadTimeDays: 9 },
  { id: 'WI_3', name: 'Supercenter #3245 (Green Bay)', state: 'WI', cluster: 'Wisconsin North', hubTransitHours: 36, leadTimeDays: 10 },
];

export const CATALOG_PRODUCTS = [
  { id: 'FOODS_1_001', name: 'Chilled Organic Milk 1-Gallon', category: 'FOODS' as const, deptId: 'FOODS_1', basePrice: 3.48, avgMonthlySales: 24.5 },
  { id: 'FOODS_1_002', name: 'Cheddar Block Cheese 16oz', category: 'FOODS' as const, deptId: 'FOODS_1', basePrice: 4.25, avgMonthlySales: 18.2 },
  { id: 'FOODS_2_010', name: 'Crispy Bakery Sliced Toast', category: 'FOODS' as const, deptId: 'FOODS_2', basePrice: 2.89, avgMonthlySales: 35.8 },
  { id: 'FOODS_3_120', name: 'Fresh Gala Apples 3lb Bag', category: 'FOODS' as const, deptId: 'FOODS_3', basePrice: 4.98, avgMonthlySales: 48.0 },
  { id: 'HOUSEHOLD_1_020', name: 'Ultra Soft Bath Tissue 12-Pack', category: 'HOUSEHOLD' as const, deptId: 'HOUSEHOLD_1', basePrice: 12.99, avgMonthlySales: 28.4 },
  { id: 'HOUSEHOLD_2_045', name: 'Heavy Duty Trash Bags 40ct', category: 'HOUSEHOLD' as const, deptId: 'HOUSEHOLD_2', basePrice: 9.48, avgMonthlySales: 15.6 },
  { id: 'HOBBIES_1_005', name: 'Classic Acoustic Guitar Strings', category: 'HOBBIES' as const, deptId: 'HOBBIES_1', basePrice: 7.95, avgMonthlySales: 11.2 },
  { id: 'HOBBIES_2_012', name: 'All-Weather Camping Lantern', category: 'HOBBIES' as const, deptId: 'HOBBIES_2', basePrice: 24.50, avgMonthlySales: 6.8 },
];

// 12-Horizon LightGBM Multi-Horizon Accuracy Benchmarks vs Baselines
// 12-Horizon LightGBM Multi-Horizon Accuracy Benchmarks vs Baselines
// Reconciled with report: Month-1 calibrated WAPE = 28.91%, Naive baseline = 44.20% (Scorecard benchmark)
export const HORIZON_BENCHMARKS: HorizonBenchmark[] = [
  { horizon: 1, targetMonth: 'Month +1', rawWape: 31.29, correctionFactor: 1.2841, calibratedWape: 28.91, naiveMovingAverageWape: 44.20 },
  { horizon: 2, targetMonth: 'Month +2', rawWape: 32.14, correctionFactor: 1.2790, calibratedWape: 29.45, naiveMovingAverageWape: 44.60 },
  { horizon: 3, targetMonth: 'Month +3', rawWape: 32.88, correctionFactor: 1.2652, calibratedWape: 29.80, naiveMovingAverageWape: 44.90 },
  { horizon: 4, targetMonth: 'Month +4', rawWape: 33.40, correctionFactor: 1.2580, calibratedWape: 30.22, naiveMovingAverageWape: 45.20 },
  { horizon: 5, targetMonth: 'Month +5', rawWape: 34.12, correctionFactor: 1.2510, calibratedWape: 30.65, naiveMovingAverageWape: 45.50 },
  { horizon: 6, targetMonth: 'Month +6', rawWape: 34.75, correctionFactor: 1.2460, calibratedWape: 31.10, naiveMovingAverageWape: 45.80 },
  { horizon: 7, targetMonth: 'Month +7', rawWape: 35.20, correctionFactor: 1.2410, calibratedWape: 31.48, naiveMovingAverageWape: 46.10 },
  { horizon: 8, targetMonth: 'Month +8', rawWape: 35.80, correctionFactor: 1.2380, calibratedWape: 31.95, naiveMovingAverageWape: 46.30 },
  { horizon: 9, targetMonth: 'Month +9', rawWape: 36.35, correctionFactor: 1.2330, calibratedWape: 32.30, naiveMovingAverageWape: 46.50 },
  { horizon: 10, targetMonth: 'Month +10', rawWape: 36.90, correctionFactor: 1.2290, calibratedWape: 32.65, naiveMovingAverageWape: 46.70 },
  { horizon: 11, targetMonth: 'Month +11', rawWape: 37.30, correctionFactor: 1.2240, calibratedWape: 32.90, naiveMovingAverageWape: 46.90 },
  { horizon: 12, targetMonth: 'Month +12', rawWape: 37.85, correctionFactor: 1.2210, calibratedWape: 33.15, naiveMovingAverageWape: 47.10 },
];

/**
 * Dynamic Reorder Point Formula (Equation 12.1 in Report):
 * ROP = (d_daily * L) + SS
 * SS = Z_alpha * sqrt(L * sigma_d^2 + d_daily^2 * sigma_L^2)
 *
 * Recommended Order Quantity when Stock < ROP:
 * Order Qty = (ROP - Current Stock) + (d_daily * L)
 * This brings current on-hand + on-order inventory safely back above safety stock after delivery.
 */
export function calculateDynamicROP(
  monthlyForecast: number,
  leadTimeDays: number,
  serviceLevelFactorZ: number = 2.054, // 98% service level
  forecastStdDev: number = 3.8,
  leadTimeVariance: number = 0.5
): { rop: number; safetyStock: number; dailyDemand: number; leadTimeDemand: number } {
  // Convert monthly forecast to daily demand (30.417 avg days/month)
  const dDaily = monthlyForecast / 30.417;
  const L = Math.max(1, leadTimeDays);
  const leadTimeDemand = dDaily * L;

  // Safety Stock term
  const varianceTerm = L * Math.pow(forecastStdDev / 30.417, 2) + Math.pow(dDaily, 2) * leadTimeVariance;
  const safetyStock = serviceLevelFactorZ * Math.sqrt(Math.max(0.1, varianceTerm));

  // ROP = Demand during Lead Time + Safety Stock
  const rop = leadTimeDemand + safetyStock;

  return {
    rop: Math.round(rop * 10) / 10,
    safetyStock: Math.round(safetyStock * 10) / 10,
    dailyDemand: Math.round(dDaily * 100) / 100,
    leadTimeDemand: Math.round(leadTimeDemand * 10) / 10,
  };
}

/**
 * Automated 3-Tier Stock Alert Classification (Table 12.1 in Report)
 */
export function classifyStockAlert(currentInventory: number, rop: number, maxStock: number): {
  tier: AlertTier;
  action: string;
} {
  if (currentInventory > maxStock) {
    return {
      tier: 'OVERSTOCK',
      action: 'Excess inventory detected; freeze purchase orders and schedule promotional markdown.',
    };
  }
  if (currentInventory < 0.8 * rop) {
    return {
      tier: 'CRITICAL',
      action: 'Issue emergency purchase order; reroute regional cross-dock delivery; flag physical shelf tag.',
    };
  }
  if (currentInventory < rop) {
    return {
      tier: 'WARNING',
      action: 'Add SKU to weekly supplier order batch; restrict cross-dock shipments to other stores.',
    };
  }
  return {
    tier: 'OK',
    action: 'Standard operating state; standard replenishment schedule.',
  };
}

/**
 * Check backend connection status
 */
export async function checkBackendHealth(): Promise<{ isOnline: boolean; data?: BackendHealth }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Health check non-200');
    const data: BackendHealth = await res.json();
    return { isOnline: true, data };
  } catch {
    return { isOnline: false };
  }
}

/**
 * Forecast single series via POST /predict
 */
export async function fetchForecast(
  productId: string,
  storeId: string,
  horizon: number = 6
): Promise<{ data: ForecastResponse; isFallback: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, storeId, horizon }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: ForecastResponse = await res.json();
    // Calculate 90% prediction intervals based on calibrated horizon error
    const enrichedForecast = data.forecast.map((pt, idx) => {
      const benchmark = HORIZON_BENCHMARKS[idx] || HORIZON_BENCHMARKS[0];
      const z90 = 1.645;
      const sigma = (benchmark.calibratedWape / 100) * pt.predictedSales;
      const lower = Math.max(0, Math.round((pt.predictedSales - z90 * sigma) * 10) / 10);
      const upper = Math.round((pt.predictedSales + z90 * sigma) * 10) / 10;
      return {
        ...pt,
        lowerBound: lower,
        upperBound: upper,
      };
    });

    return {
      data: {
        ...data,
        forecast: enrichedForecast,
      },
      isFallback: false,
    };
  } catch {
    // Generate mathematically calibrated fallback forecast matching Table 10.1
    const fallbackData = generateFallbackForecast(productId, storeId, horizon);
    return { data: fallbackData, isFallback: true };
  }
}

/**
 * Fallback generator consistent with Walmart M5 LightGBM output
 */
export function generateFallbackForecast(
  productId: string,
  storeId: string,
  horizon: number
): ForecastResponse {
  const prod = CATALOG_PRODUCTS.find((p) => p.id === productId) || {
    avgMonthlySales: 22.0,
    basePrice: 3.5,
  };
  const baseSales = prod.avgMonthlySales;

  const startDate = new Date(2016, 6, 31); // 2016-07-31 from M5 dataset
  const points = [];

  for (let h = 1; h <= horizon; h++) {
    const targetDate = new Date(startDate.getFullYear(), startDate.getMonth() + (h - 1), 1);
    const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    const month = lastDayOfMonth.getMonth() + 1;

    // Seasonal wave: Q4 holiday surge, January dip
    const seasonalFactor = 1.0 + 0.22 * Math.sin((2 * Math.PI * (month - 4)) / 12);
    // Horizon correction factor from Table 10.1
    const benchmark = HORIZON_BENCHMARKS[h - 1] || HORIZON_BENCHMARKS[0];
    const correctionFactor = benchmark.correctionFactor || 1.24;
    // Base demand projection
    const rawDemand = baseSales * seasonalFactor * (1 - (h * 0.012));
    const predictedSales = Math.max(1.0, Math.round(rawDemand * (correctionFactor / 1.25) * 100) / 100);

    // 90% confidence uncertainty interval (Equation: y ± 1.645 * sigma_h)
    const z90 = 1.645;
    const sigma = (benchmark.calibratedWape / 100) * predictedSales;
    const lowerBound = Math.max(0, Math.round((predictedSales - z90 * sigma) * 10) / 10);
    const upperBound = Math.round((predictedSales + z90 * sigma) * 10) / 10;

    let confidence: 'high' | 'medium' | 'low' | 'very_low' = 'high';
    if (h > 9) confidence = 'very_low';
    else if (h > 6) confidence = 'low';
    else if (h > 3) confidence = 'medium';

    const y = lastDayOfMonth.getFullYear();
    const m = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0');
    const d = String(lastDayOfMonth.getDate()).padStart(2, '0');

    points.push({
      date: `${y}-${m}-${d}`,
      predictedSales,
      confidence,
      lowerBound,
      upperBound,
    });
  }

  return {
    productId,
    storeId,
    horizon,
    forecast: points,
  };
}

/**
 * Generate simulated inventory status items for the 10 stores
 */
export function getInitialInventoryItems(): InventoryItem[] {
  const items: InventoryItem[] = [];

  CATALOG_PRODUCTS.forEach((prod, pIdx) => {
    STORES.slice(0, 4).forEach((store, sIdx) => {
      const forecastDemandMonth1 = Math.round((prod.avgMonthlySales * (0.85 + (pIdx * 0.15 + sIdx * 0.1) % 0.4)) * 10) / 10;
      const { rop, safetyStock, leadTimeDemand } = calculateDynamicROP(forecastDemandMonth1, store.leadTimeDays);
      const maxStock = Math.round(rop * 2.8);

      // Create a realistic distribution of CRITICAL, WARNING, OK, and OVERSTOCK
      let stockLevel = rop * 1.35;
      const seed = (pIdx + sIdx * 3) % 10;
      if (seed === 0 || seed === 4) {
        stockLevel = rop * 0.55; // CRITICAL (< 0.8 * ROP)
      } else if (seed === 1 || seed === 7) {
        stockLevel = rop * 0.85; // WARNING (0.8*ROP <= stock < ROP)
      } else if (seed === 9) {
        stockLevel = maxStock * 1.15; // OVERSTOCK
      }

      const currentStock = Math.round(stockLevel);
      const { tier, action } = classifyStockAlert(currentStock, rop, maxStock);
      
      // Clear formula-based order quantity:
      // If below ROP, order enough to cover lead time demand and restore safety stock:
      // Order Qty = ceil((ROP - Current Stock) + Lead Time Demand)
      let recommendedOrder = 0;
      let orderCalculationExplanation = 'Stock is currently above reorder threshold. No replenishment needed.';
      if (currentStock < rop) {
        recommendedOrder = Math.max(1, Math.ceil((rop - currentStock) + leadTimeDemand));
        orderCalculationExplanation = `Deficit below ROP (${Math.round((rop - currentStock) * 10) / 10}) + Lead-Time Demand (${leadTimeDemand}) = ${recommendedOrder} units`;
      }

      items.push({
        id: `${prod.id}_${store.id}`,
        productId: prod.id,
        storeId: store.id,
        name: prod.name,
        category: prod.category,
        deptId: prod.deptId,
        currentStock,
        maxStock,
        leadTimeDays: store.leadTimeDays,
        unitPrice: prod.basePrice,
        lastMonthSales: Math.round(forecastDemandMonth1 * 0.94),
        forecastDemandMonth1,
        leadTimeDemand,
        rop,
        safetyStock,
        status: tier,
        recommendedOrder,
        orderCalculationExplanation,
        triggeredAction: action,
      });
    });
  });

  return items;
}
