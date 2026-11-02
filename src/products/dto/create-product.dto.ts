import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsOptional,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsInt()
    @Min(0)
    priceInKurus: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    stockQuantity?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    categoryId?: string | null; // bir string ya da null olabilir
}