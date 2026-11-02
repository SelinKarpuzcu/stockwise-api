import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from  'class-validator';

export class UpdateCategoryDto {
    @ValidateIf((_object, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name?: string;
}