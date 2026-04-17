/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "fullname" VARCHAR(100) NOT NULL DEFAULT 'New User';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
DROP COLUMN "fullname";
