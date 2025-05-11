import fs from 'fs';
import path from 'path';

import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

interface BrandRow {
  name: string;
  logoPath: string | null;
  description: string | null;
  isActive: boolean; // Dữ liệu từ CSV vẫn được giữ nguyên kiểu boolean
}

async function main() {
  const filePath = path.resolve(__dirname, './brands.csv');
  const brands: BrandRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: BrandRow) => {
        // Bạn có thể bỏ qua giá trị từ CSV và trực tiếp gán isActive là true
        row.isActive = true; // Đặt isActive luôn là true
        brands.push(row);
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  console.log(`Đã đọc ${brands.length} dòng từ CSV`);

  for (const { name, logoPath, description, isActive } of brands) {
    await prisma.brand.create({
      data: {
        name,
        logoPath,
        description,
        isActive, // Giá trị isActive luôn là true
      },
    });
  }

  console.log('Import xong!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
