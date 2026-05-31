import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }) // NUMERIC(10,2) as in the DB Postgresql
  @Min(0)
  @IsOptional()
  price?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

