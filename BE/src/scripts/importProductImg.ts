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
      // Kiểm tra sản phẩm có tồn tại trong bảng Product hay không
      const existingProduct = await prisma.product.findUnique({
        where: { sku: product.sku },
      });

      if (existingProduct) {
        // Duyệt qua tất cả các hình ảnh của sản phẩm
        for (let i = 0; i < product.images.length; i++) {
          await prisma.productImage.create({
            data: {
              productId: existingProduct.id, // Sử dụng productId của sản phẩm đã tìm thấy
              imageUrl: product.images[i], // Lấy URL hình ảnh
              isThumbnail: i === 0, // Chỉ có ảnh đầu tiên là Thumbnail
              displayOrder: i + 1, // Thứ tự hiển thị (1, 2, 3,...)
            },
          });
        }

        console.log(`✅ Imported images for product: ${product.sku}`);
      } else {
        console.log(`❌ Product with SKU ${product.sku} not found.`);
      }
    } catch (err) {
      console.error(`❌ Error importing images for product with SKU ${product.sku}:`, err);
    }
  }

  console.log('✅ Done importing all images!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
