import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
// Tüm kategori endpoint'lerine erişim için geçerli bir JWT gereklidir.
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    create(
        @Req() req: any,
        @Body() dto: CreateCategoryDto,
    ) {
        return this.categoriesService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.categoriesService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(
        @Req() req: any,
        @Param('id') id: string,
    ) {
        return this.categoriesService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(
            req.user.userId,
            id,
            dto,
        );
    }

    @Delete(':id')
    remove(
        @Req() req: any,
        @Param('id') id: string,
    ) {
        return this.categoriesService.remove(req.user.userId, id);
    }
}
