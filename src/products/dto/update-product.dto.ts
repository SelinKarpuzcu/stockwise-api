import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsOptional,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

export class UpdateProductDto {
    @ValidateIf((_obj, value) => value !== undefined) // undefined ise altındaki dekoratörleri atlar (doğrulama atlanır), değilse alt satıra geçer
    @IsNotEmpty() // null bu satıra geçince hata fırlatılır
    @IsString()
    @MaxLength(100)
    name?: string;

    @ValidateIf((_obj, value) => value !== undefined)
    @IsInt()
    @Min(0)
    priceInKurus?: number;

    @ValidateIf((_obj, value) => value !== undefined)
    @IsInt()
    @Min(0)
    stockQuantity?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    categoryId?: string | null; // bir string ya da null olabilir
}