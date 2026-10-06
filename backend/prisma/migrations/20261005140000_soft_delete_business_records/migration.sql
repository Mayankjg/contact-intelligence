ALTER TABLE "Contact" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "ProductService" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Purchase" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "PurchaseFollowUp" ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "Contact_deletedAt_idx" ON "Contact"("deletedAt");
CREATE INDEX "Product_deletedAt_idx" ON "Product"("deletedAt");
CREATE INDEX "ProductService_deletedAt_idx" ON "ProductService"("deletedAt");
CREATE INDEX "Purchase_deletedAt_idx" ON "Purchase"("deletedAt");
CREATE INDEX "PurchaseFollowUp_deletedAt_idx" ON "PurchaseFollowUp"("deletedAt");