import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface Product {
    id: number;
    attributes: Record<string, string>;
}

async function importProductAttributes() {
    try {
        // Delete all existing records and reset sequences
        console.log('Deleting existing records...');
        await prisma.productAttributeValue.deleteMany({});
        await prisma.attribute.deleteMany({});

        // Reset the sequences for both tables
        await prisma.$executeRaw`ALTER SEQUENCE "Attributes_AttributeID_seq" RESTART WITH 1;`;
        await prisma.$executeRaw`ALTER SEQUENCE "ProductAttributeValues_ProductAttributeValueID_seq" RESTART WITH 1;`;

        console.log('Reset completed. Starting import...');

        // Read products.json
        const productsData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8')
        ) as Product[];

        for (const product of productsData) {
            // Check if product exists
            const existingProduct = await prisma.product.findUnique({
                where: { id: product.id },
            });

            if (!existingProduct) {
                console.log(`Product with ID ${product.id} not found, skipping...`);
                continue;
            }

            // Create attribute with JSON value
            const attribute = await prisma.attribute.create({
                data: {
                    value: JSON.stringify(product.attributes),
                    isVariantAttribute: false,
                },
            });

            // Create product attribute value relation
            await prisma.productAttributeValue.create({
                data: {
                    productId: product.id,
                    attributeId: attribute.id,
                },
            });

            console.log(`Imported attributes for product ID ${product.id}`);
        }

        console.log('Import completed successfully!');
    } catch (error) {
        console.error('Error importing product attributes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importProductAttributes(); 