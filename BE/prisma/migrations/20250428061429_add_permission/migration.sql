/*
  Warnings:

  - You are about to drop the column `Permissions` on the `Roles` table. All the data in the column will be lost.
  - You are about to drop the column `FullName` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Addresses" ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "ward" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Roles" DROP COLUMN "Permissions";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "FullName",
ADD COLUMN     "FirstName" TEXT,
ADD COLUMN     "LastName" TEXT;

-- CreateTable
CREATE TABLE "Permissions" (
    "PermissionID" BIGSERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("PermissionID")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "RolePermissionID" BIGSERIAL NOT NULL,
    "RoleID" BIGINT NOT NULL,
    "PermissionID" BIGINT NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("RolePermissionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_Code_key" ON "Permissions"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissions_RoleID_PermissionID_key" ON "RolePermissions"("RoleID", "PermissionID");

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_RoleID_fkey" FOREIGN KEY ("RoleID") REFERENCES "Roles"("RoleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_PermissionID_fkey" FOREIGN KEY ("PermissionID") REFERENCES "Permissions"("PermissionID") ON DELETE RESTRICT ON UPDATE CASCADE;
