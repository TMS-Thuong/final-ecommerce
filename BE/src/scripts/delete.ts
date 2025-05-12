// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//     try {
//         // Xóa toàn bộ dữ liệu trong bảng Product
//         await prisma.product.deleteMany({});
//         console.log('✅ All products have been deleted.');
//     } catch (error) {
//         console.error('❌ Error deleting products:', error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// main().catch((e) => {
//     console.error(e);
//     process.exit(1);
// });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.productImage.deleteMany({});
    console.log('✅ All product images have been deleted.');
  } catch (error) {
    console.error('❌ Error deleting product images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
