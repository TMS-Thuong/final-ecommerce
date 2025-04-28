-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled', 'Failed', 'Completed');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed', 'Refunded');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed_amount');

-- CreateTable
CREATE TABLE "Users" (
    "UserID" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "GoogleID" TEXT,
    "FullName" TEXT,
    "PhoneNumber" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Addresses" (
    "AddressID" BIGSERIAL NOT NULL,
    "UserID" BIGINT NOT NULL,
    "RecipientName" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "StreetAddress" TEXT NOT NULL,
    "IsDefaultShipping" BOOLEAN NOT NULL DEFAULT false,
    "IsDefaultBilling" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("AddressID")
);

-- CreateTable
CREATE TABLE "Categories" (
    "CategoryID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "ParentCategoryID" INTEGER,
    "DisplayOrder" INTEGER NOT NULL DEFAULT 0,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "Brands" (
    "BrandID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "LogoPath" TEXT,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Brands_pkey" PRIMARY KEY ("BrandID")
);

-- CreateTable
CREATE TABLE "Products" (
    "ProductID" SERIAL NOT NULL,
    "SKU" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Description" TEXT,
    "CategoryID" INTEGER NOT NULL,
    "BrandID" INTEGER NOT NULL,
    "BasePrice" DECIMAL(18,2) NOT NULL,
    "SalePrice" DECIMAL(18,2),
    "StockQuantity" INTEGER NOT NULL DEFAULT 0,
    "AverageRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "RatingCount" INTEGER NOT NULL DEFAULT 0,
    "ViewCount" INTEGER NOT NULL DEFAULT 0,
    "SoldCount" INTEGER NOT NULL DEFAULT 0,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsFeatured" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("ProductID")
);

-- CreateTable
CREATE TABLE "ProductImages" (
    "ImageID" SERIAL NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "ImageURL" TEXT NOT NULL,
    "IsThumbnail" BOOLEAN NOT NULL DEFAULT false,
    "DisplayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductImages_pkey" PRIMARY KEY ("ImageID")
);

-- CreateTable
CREATE TABLE "Attributes" (
    "AttributeID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "IsVariantAttribute" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attributes_pkey" PRIMARY KEY ("AttributeID")
);

-- CreateTable
CREATE TABLE "AttributeValues" (
    "ValueID" BIGSERIAL NOT NULL,
    "AttributeID" INTEGER NOT NULL,
    "Value" TEXT NOT NULL,

    CONSTRAINT "AttributeValues_pkey" PRIMARY KEY ("ValueID")
);

-- CreateTable
CREATE TABLE "ProductAttributeValues" (
    "ProductAttributeValueID" BIGSERIAL NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "AttributeID" INTEGER NOT NULL,
    "ValueID" BIGINT NOT NULL,

    CONSTRAINT "ProductAttributeValues_pkey" PRIMARY KEY ("ProductAttributeValueID")
);

-- CreateTable
CREATE TABLE "Carts" (
    "CartID" TEXT NOT NULL,
    "UserID" BIGINT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("CartID")
);

-- CreateTable
CREATE TABLE "CartItems" (
    "CartItemID" BIGSERIAL NOT NULL,
    "CartID" TEXT NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL DEFAULT 1,
    "AddedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Options" JSONB,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("CartItemID")
);

-- CreateTable
CREATE TABLE "Orders" (
    "OrderID" BIGSERIAL NOT NULL,
    "OrderCode" TEXT NOT NULL,
    "UserID" BIGINT,
    "AddressID" BIGINT,
    "PaymentID" BIGINT NOT NULL,
    "ShippingID" BIGINT,
    "Subtotal" DECIMAL(18,2) NOT NULL,
    "ShippingFee" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "DiscountAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "CouponCode" TEXT,
    "TotalAmount" DECIMAL(18,2) NOT NULL,
    "Status" "OrderStatus" NOT NULL DEFAULT 'Pending',
    "CustomerNotes" TEXT,
    "TrackingID" TEXT,
    "PaymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("OrderID")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "OrderItemID" BIGSERIAL NOT NULL,
    "OrderID" BIGINT NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "ProductName" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Price" DECIMAL(18,2) NOT NULL,
    "Subtotal" DECIMAL(18,2) NOT NULL,
    "DiscountAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "Status" TEXT NOT NULL DEFAULT 'Pending',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("OrderItemID")
);

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "PaymentID" BIGSERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("PaymentID")
);

-- CreateTable
CREATE TABLE "ShippingMethods" (
    "ShippingID" BIGSERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "ShippingMethods_pkey" PRIMARY KEY ("ShippingID")
);

-- CreateTable
CREATE TABLE "Coupons" (
    "CouponID" BIGSERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "DiscountType" "DiscountType" NOT NULL,
    "DiscountValue" DECIMAL(18,2) NOT NULL,
    "MaxUsage" INTEGER,
    "UsageCount" INTEGER NOT NULL DEFAULT 0,
    "MaxUsagePerUser" INTEGER,
    "MinOrderValue" DECIMAL(18,2),
    "StartDate" TIMESTAMP(3),
    "EndDate" TIMESTAMP(3),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupons_pkey" PRIMARY KEY ("CouponID")
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "HistoryID" BIGSERIAL NOT NULL,
    "OrderID" BIGINT NOT NULL,
    "Status" "OrderStatus" NOT NULL,
    "ChangedByAdminID" BIGINT,
    "ChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("HistoryID")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "FavoriteID" BIGSERIAL NOT NULL,
    "UserID" BIGINT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("FavoriteID")
);

-- CreateTable
CREATE TABLE "FavoriteItems" (
    "FavoriteItemID" BIGSERIAL NOT NULL,
    "FavoriteID" BIGINT NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "AddedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteItems_pkey" PRIMARY KEY ("FavoriteItemID")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "ReviewID" BIGSERIAL NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "UserID" BIGINT NOT NULL,
    "OrderID" BIGINT NOT NULL,
    "Rating" INTEGER NOT NULL,
    "Title" TEXT,
    "Comment" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("ReviewID")
);

-- CreateTable
CREATE TABLE "ReviewImages" (
    "ReviewImageID" BIGSERIAL NOT NULL,
    "ReviewID" BIGINT NOT NULL,
    "ImageURL" TEXT NOT NULL,

    CONSTRAINT "ReviewImages_pkey" PRIMARY KEY ("ReviewImageID")
);

-- CreateTable
CREATE TABLE "Admin" (
    "AdminID" BIGSERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "FullName" TEXT,
    "RoleID" BIGINT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminID")
);

-- CreateTable
CREATE TABLE "Roles" (
    "RoleID" BIGSERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Permissions" JSONB NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("RoleID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_GoogleID_key" ON "Users"("GoogleID");

-- CreateIndex
CREATE UNIQUE INDEX "Users_PhoneNumber_key" ON "Users"("PhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Brands_Name_key" ON "Brands"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_SKU_key" ON "Products"("SKU");

-- CreateIndex
CREATE UNIQUE INDEX "Products_Slug_key" ON "Products"("Slug");

-- CreateIndex
CREATE UNIQUE INDEX "Attributes_Name_key" ON "Attributes"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Attributes_Code_key" ON "Attributes"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_OrderCode_key" ON "Orders"("OrderCode");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethods_Code_key" ON "PaymentMethods"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "Coupons_Code_key" ON "Coupons"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_UserID_key" ON "Favorites"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteItems_FavoriteID_ProductID_key" ON "FavoriteItems"("FavoriteID", "ProductID");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_ProductID_UserID_OrderID_key" ON "Reviews"("ProductID", "UserID", "OrderID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Username_key" ON "Admin"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Email_key" ON "Admin"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_Name_key" ON "Roles"("Name");

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_ParentCategoryID_fkey" FOREIGN KEY ("ParentCategoryID") REFERENCES "Categories"("CategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Categories"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_BrandID_fkey" FOREIGN KEY ("BrandID") REFERENCES "Brands"("BrandID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValues" ADD CONSTRAINT "AttributeValues_AttributeID_fkey" FOREIGN KEY ("AttributeID") REFERENCES "Attributes"("AttributeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValues" ADD CONSTRAINT "ProductAttributeValues_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValues" ADD CONSTRAINT "ProductAttributeValues_ValueID_fkey" FOREIGN KEY ("ValueID") REFERENCES "AttributeValues"("ValueID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_CartID_fkey" FOREIGN KEY ("CartID") REFERENCES "Carts"("CartID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_AddressID_fkey" FOREIGN KEY ("AddressID") REFERENCES "Addresses"("AddressID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_PaymentID_fkey" FOREIGN KEY ("PaymentID") REFERENCES "PaymentMethods"("PaymentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_ShippingID_fkey" FOREIGN KEY ("ShippingID") REFERENCES "ShippingMethods"("ShippingID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Orders"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Orders"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_ChangedByAdminID_fkey" FOREIGN KEY ("ChangedByAdminID") REFERENCES "Admin"("AdminID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteItems" ADD CONSTRAINT "FavoriteItems_FavoriteID_fkey" FOREIGN KEY ("FavoriteID") REFERENCES "Favorites"("FavoriteID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteItems" ADD CONSTRAINT "FavoriteItems_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Orders"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewImages" ADD CONSTRAINT "ReviewImages_ReviewID_fkey" FOREIGN KEY ("ReviewID") REFERENCES "Reviews"("ReviewID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_RoleID_fkey" FOREIGN KEY ("RoleID") REFERENCES "Roles"("RoleID") ON DELETE RESTRICT ON UPDATE CASCADE;
