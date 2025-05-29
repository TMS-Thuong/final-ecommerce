import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    // Đọc file JSON chứa dữ liệu
    const dataPath = path.join(__dirname, 'seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Import Categories
    if (seedData.categories) {
      for (const category of seedData.categories) {
        await prisma.category.upsert({
          where: { id: category.id },
          update: category,
          create: category,
        });
      }
    }

    // Import Brands
    if (seedData.brands) {
      for (const brand of seedData.brands) {
        await prisma.brand.upsert({
          where: { id: brand.id },
          update: brand,
          create: brand,
        });
      }
    }

    // Import Products
    if (seedData.products) {
      for (const product of seedData.products) {
        await prisma.product.upsert({
          where: { id: product.id },
          update: product,
          create: product,
        });
      }
    }

    // Import Product Images
    if (seedData.productImages) {
      for (const image of seedData.productImages) {
        await prisma.productImage.upsert({
          where: { id: image.id },
          update: image,
          create: image,
        });
      }
    }

    // Import Attributes
    if (seedData.attributes) {
      for (const attribute of seedData.attributes) {
        await prisma.attribute.upsert({
          where: { id: attribute.id },
          update: attribute,
          create: attribute,
        });
      }
    }

    // Import Product Attribute Values
    if (seedData.productAttributeValues) {
      for (const pav of seedData.productAttributeValues) {
        await prisma.productAttributeValue.upsert({
          where: { id: pav.id },
          update: pav,
          create: pav,
        });
      }
    }

    console.log('Seed data imported successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
