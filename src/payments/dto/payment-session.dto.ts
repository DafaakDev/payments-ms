import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MetadataDto {
  @IsString()
  order: string;
}

export class PaymentSessionDto {
  @IsNotEmpty()
  @Type(() => MetadataDto)
  metadata: MetadataDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemDto)
  line_items: PaymentSessionItemDto[];

  // @IsOptional()
  // @IsString()
  // mode?: string = 'payment';
  //
  // @IsOptional()
  // @IsString()
  // success_url?: string = 'http://localhost:3003/payments/success';
  //
  // @IsOptional()
  // @IsString()
  // cancel_url?: string = 'http://localhost:3003/payments/calceled';
}

export class ProductDataDto {
  @IsString()
  name: string;
}

export class PriceDataDto {
  currency = 'usd';
  @IsNotEmpty()
  @Type(() => ProductDataDto)
  product_data: ProductDataDto;

  @IsNumber()
  @IsPositive()
  unit_amount: number;
}

export class PaymentSessionItemDto {
  @IsNotEmpty()
  @Type(() => PriceDataDto)
  price_data: PriceDataDto;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
