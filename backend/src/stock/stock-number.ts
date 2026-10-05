import { randomInt } from 'node:crypto';
import { StockMovementType } from '@prisma/client';

export function createStockDocumentNumber(type: StockMovementType) {
  const prefix = type === StockMovementType.INWARD ? 'INW' : 'OUT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = randomInt(0, 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, '0');
  return `${prefix}-${timestamp}-${suffix}`;
}
