
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarVeiculoDto {
  @IsString()
  @Matches(/^[1-9]\d*$/)
  categoria_veiculo_id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  veiculo_placa!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  veiculo_marca!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  veiculo_modelo!: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  veiculo_ano_fabricacao!: number;

  @IsInt()
  @Min(1900)
  @Max(2100)
  veiculo_ano_modelo!: number;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  veiculo_cor?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  veiculo_quilometragem?: number;

  @IsInt()
  veiculo_status!: number;
}
