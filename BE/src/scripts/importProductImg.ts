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
        // Kiểm tra xem sản phẩm đã có hình ảnh nào chưa
        const existingImages = await prisma.productImage.findMany({
          where: {
            productId: existingProduct.id,
          },
        });

        if (existingImages.length === 0) {
          // Chưa có hình ảnh nào, tiến hành thêm tất cả hình ảnh cho sản phẩm
          for (let i = 0; i < product.images.length; i++) {
            const imageUrl = product.images[i];

            await prisma.productImage.create({
              data: {
                productId: existingProduct.id, // Sử dụng productId của sản phẩm đã tìm thấy
                imageUrl: imageUrl, // Lấy URL hình ảnh
                isThumbnail: i === 0, // Chỉ có ảnh đầu tiên là Thumbnail
                displayOrder: i + 1, // Thứ tự hiển thị (1, 2, 3,...)
              },
            });

            console.log(`✅ Imported image for product SKU ${product.sku} at position ${i + 1}`);
          }
        } else {
          console.log(`❌ Product SKU ${product.sku} already has images, skipping import.`);
        }
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
