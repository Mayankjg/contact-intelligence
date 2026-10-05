CREATE TYPE "StockOutwardPurpose" AS ENUM (
  'SALE',
  'INSTALLATION',
  'SERVICE_REPLACEMENT',
  'DEALER_TRANSFER',
  'DAMAGED',
  'SAMPLE',
  'INTERNAL_TRANSFER',
  'OTHER'
);
CREATE TYPE "StockMovementStatus" AS ENUM ('RECEIVED', 'DELIVERED');

ALTER TABLE "StockMovement"
  ADD COLUMN "documentNo" TEXT,
  ADD COLUMN "status" "StockMovementStatus",
  ADD COLUMN "supplier" TEXT,
  ADD COLUMN "customer" TEXT,
  ADD COLUMN "purpose" "StockOutwardPurpose",
  ADD COLUMN "invoiceNo" TEXT,
  ADD COLUMN "unitPrice" DECIMAL(12,2),
  ADD COLUMN "batchNo" TEXT,
  ADD COLUMN "warehouse" TEXT NOT NULL DEFAULT 'Main Warehouse',
  ADD COLUMN "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

WITH numbered AS (
  SELECT "id", "type", row_number() OVER (PARTITION BY "type" ORDER BY "createdAt", "id") AS seq
  FROM "StockMovement"
)
UPDATE "StockMovement" AS movement
SET "documentNo" = CASE numbered."type"
  WHEN 'INWARD' THEN 'INW-' || lpad(numbered.seq::text, 5, '0')
  ELSE 'OUT-' || lpad(numbered.seq::text, 5, '0')
END,
"status" = CASE numbered."type" WHEN 'INWARD' THEN 'RECEIVED'::"StockMovementStatus" ELSE 'DELIVERED'::"StockMovementStatus" END
FROM numbered
WHERE movement."id" = numbered."id";

ALTER TABLE "StockMovement" ALTER COLUMN "documentNo" SET NOT NULL;
ALTER TABLE "StockMovement" ALTER COLUMN "status" SET NOT NULL;
CREATE UNIQUE INDEX "StockMovement_documentNo_key" ON "StockMovement"("documentNo");
CREATE INDEX "StockMovement_invoiceNo_idx" ON "StockMovement"("invoiceNo");
DROP INDEX IF EXISTS "StockMovement_productId_createdAt_idx";
DROP INDEX IF EXISTS "StockMovement_type_createdAt_idx";
CREATE INDEX "StockMovement_productId_occurredAt_idx" ON "StockMovement"("productId", "occurredAt");
CREATE INDEX "StockMovement_type_occurredAt_idx" ON "StockMovement"("type", "occurredAt");

CREATE TABLE "StockClosure" (
  "id" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockClosure_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StockClosure_startDate_endDate_key" ON "StockClosure"("startDate", "endDate");

CREATE TABLE "StockClosureLine" (
  "id" TEXT NOT NULL,
  "closureId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "opening" INTEGER NOT NULL,
  "inward" INTEGER NOT NULL,
  "outward" INTEGER NOT NULL,
  "closing" INTEGER NOT NULL,
  CONSTRAINT "StockClosureLine_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "StockClosureLine_closureId_fkey" FOREIGN KEY ("closureId") REFERENCES "StockClosure"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "StockClosureLine_closureId_productId_key" ON "StockClosureLine"("closureId", "productId");
