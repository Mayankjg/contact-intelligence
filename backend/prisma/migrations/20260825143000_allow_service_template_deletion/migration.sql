ALTER TABLE "CustomerService" DROP CONSTRAINT "CustomerService_productServiceId_fkey";
ALTER TABLE "CustomerService" ALTER COLUMN "productServiceId" DROP NOT NULL;
ALTER TABLE "CustomerService" ADD CONSTRAINT "CustomerService_productServiceId_fkey" FOREIGN KEY ("productServiceId") REFERENCES "ProductService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
