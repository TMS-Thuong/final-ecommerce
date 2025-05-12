import fs from 'fs';
import path from 'path';

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, './products.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(rawData);

  for (const product of products) {
    try {
      await prisma.product.create({
        data: {
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          basePrice: new Prisma.Decimal(product.price),
          salePrice: new Prisma.Decimal(product.sale_price),
          stockQuantity: product.stock_quantity || 0,
          averageRating: new Prisma.Decimal(product.averageRating || 0),
          ratingCount: product.ratingCount || 0,
          viewCount: product.viewCount || 0,
          soldCount: product.soldCount || 0,
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured ?? false,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { connect: { id: product.category_id } },
          brand: { connect: { id: product.brand_id } },
        },
      });
      console.log(`✅ Imported product: ${product.name}`);
    } catch (err) {
      console.error(`❌ Error importing product ${product.name}:`, err);
    }
  }

  console.log('✅ Done importing all products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
