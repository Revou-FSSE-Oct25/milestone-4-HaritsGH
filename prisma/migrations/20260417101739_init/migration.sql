-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('D', 'W', 'T');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "userpw" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "favnum" INTEGER,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "owner" VARCHAR(100) NOT NULL,
    "geneid" VARCHAR(8) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "txprocess" "TxType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "done_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account" VARCHAR(8) NOT NULL,
    "transfer_to" VARCHAR(8),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_geneid_key" ON "accounts"("geneid");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("geneid") ON DELETE RESTRICT ON UPDATE CASCADE;
