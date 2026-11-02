import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateCategoryDto) {
        // Kategori isimleri aynı kullanıcı için benzersiz olmalıdır.
        const existing = await this.prisma.category.findFirst({
            where: {
                name: dto.name,
                userId,
            },
        });
        if (existing) {
            throw new ConflictException('A category with this name already existing.');
        }

        return this.prisma.category.create({
            data: {
                name: dto.name,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.category.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc'},
        });
    }

    async findOne(userId: string, id: string) {
        // Kategori ID'sinin yanında kullanıcı ID'si de kontrol edilerek veri izolasyonu sağlanır.
        const category = await this.prisma.category.findFirst({
            where: { id, userId },
        });

        if (!category) {
            throw new NotFoundException('Category not found.');
        }

        return category;
    }

    async update(
        userId: string,
        id: string,
        dto: UpdateCategoryDto,
    ) {
        await this.findOne(userId, id);

        if (dto.name !== undefined) {
            const existing = await this.prisma.category.findFirst({
                where: {
                    name: dto.name,
                    userId,
                    NOT: { id }, // Kendisi hariç
                },
            });

            if (existing) {
                throw new ConflictException('A category with this name already exists.');
            }
        }

        return this.prisma.category.update({
            where: { id, userId },
            data: dto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);

        await this.prisma.category.delete({
            where: { id, userId },
        });

        return { message: 'Category deleted successfully.'};
    }
}
