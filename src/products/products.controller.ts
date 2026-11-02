import {
    Body,
    Controller,
    Get,
    Delete,
    Post,
    Patch,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    create(
        @Req() req: any,
        @Body() dto: CreateProductDto,
    ) {
        return this.productsService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Req() req: any){
        return this.productsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(
        @Req() req: any,
        @Param('id') id: string,
    ) {
        return this.productsService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productsService.update(req.user.userId, id, dto);
    }

    @Delete(':id')
    remove(
        @Req() req: any,
        @Param('id') id: string,
    ) {
        return this.productsService.remove(req.user.userId, id);
    }
}
