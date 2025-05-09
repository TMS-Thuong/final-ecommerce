/*
  Warnings:

  - The `gender` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "gender",
ADD COLUMN     "gender" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "Gender";
