// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function resetProductTable() {
//     try {
//         await prisma.$executeRaw`TRUNCATE TABLE "Products" RESTART IDENTITY CASCADE;`;
//         console.log('✅ Product table has been reset!');
//     } catch (error) {
//         console.error('❌ Error resetting table:', error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// resetProductTable();
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   try {
//     // Xóa tất cả dữ liệu trong bảng `productImage` và `product`
//     await prisma.productImage.deleteMany({});

//     // Reset lại ID (dành cho PostgreSQL)
//     await prisma.$executeRaw`TRUNCATE TABLE "ProductImage" RESTART IDENTITY CASCADE`;

//     console.log('✅ Data has been deleted and IDs have been reset to 1.');
//   } catch (err) {
//     console.error('❌ Error:', err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
