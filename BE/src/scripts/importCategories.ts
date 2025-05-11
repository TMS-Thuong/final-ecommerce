import fs from 'fs';
import path from 'path';

import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

interface CategoryRow {
  name: string;
  link: string;
}

async function main() {
  const filePath = path.resolve(__dirname, './categories.csv');
  const categories: CategoryRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: CategoryRow) => {
        categories.push(row);
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  console.log(`Đã đọc ${categories.length} dòng từ CSV`);

  for (const { name } of categories) {
    await prisma.category.create({
      data: { name },
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
