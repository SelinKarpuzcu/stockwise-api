import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService){}

    async create(userId: string, dto: CreateProductDto){
        if (dto.categoryId) {
            // Ürüne yalnızca aynı kullanıcıya ait bir kategori bağlanabilir.
            const category = await this.prisma.category.findFirst({
                where: {
                    id: dto.categoryId,
                    userId,
                },
            });

            if(!category) {
                throw new NotFoundException('Category not found.');
            }
        }

        return this.prisma.product.create({
            data: {
                name: dto.name,
                priceInKurus: dto.priceInKurus,
                stockQuantity: dto.stockQuantity ?? 0,
                userId,
                categoryId: dto.categoryId ?? null,
            },
            include: { category: true },
        });
    }

    async findAll(userId: string) {
        return this.prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
    }

    async findOne(userId: string, id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, userId },
            include: { category: true },
        });

        if(!product) {
            throw new NotFoundException('Product not found.');
        }

        return product;
    }

    async update(userId: string, id: string, dto: UpdateProductDto) {
        await this.findOne(userId, id);

        if(dto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: {
                    id: dto.categoryId,
                    userId,
                },
            });

            if(!category) {
                throw new NotFoundException('Category not found.');
            }
        }

        return this.prisma.product.update({
            where:{ id, userId },
            data: {
                // Yalnızca gönderilen alanlar güncellenir; null değeri de korunur.
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.priceInKurus !== undefined && { priceInKurus: dto.priceInKurus }),
                ...(dto.stockQuantity !== undefined && { stockQuantity: dto.stockQuantity }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                userId,
            },
            include: { category: true },
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);

        await this.prisma.product.delete({
            where: { id, userId },
        });

        return { message: 'Product deleted successfull.'};
    }
}
