import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Xóa toàn bộ dữ liệu trong bảng 'Attribute'
        await prisma.attribute.deleteMany({});
        console.log('✅ All records in the Attribute table have been deleted.');
    } catch (err) {
        console.error('❌ Error deleting records in the Attribute table:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
