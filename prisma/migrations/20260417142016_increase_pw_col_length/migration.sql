-- AlterTable
ALTER TABLE "users" ALTER COLUMN "userpw" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transfer_to_fkey" FOREIGN KEY ("transfer_to") REFERENCES "accounts"("genId") ON DELETE SET NULL ON UPDATE CASCADE;
