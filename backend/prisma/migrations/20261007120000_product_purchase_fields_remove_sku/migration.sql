DROP INDEX IF EXISTS "Product_sku_key";

ALTER TABLE "Product"
  DROP COLUMN IF EXISTS "sku",
  ADD COLUMN "supplierName" TEXT,
  ADD COLUMN "purchaseDate" TIMESTAMP(3),
  ADD COLUMN "unitCost" DECIMAL(12, 2);

ALTER TABLE "StockClosureLine"
  DROP COLUMN IF EXISTS "sku";
