CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

ALTER TABLE "Purchase"
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
