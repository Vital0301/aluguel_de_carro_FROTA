
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Matches,
  MaxLength,
} from 'class-validator';

export class CriarCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoria_veiculo_nome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  categoria_veiculo_descricao?: string;

  @IsString()
  @Matches(/^\d{1,8}(\.\d{1,2})?$/)
  categoria_veiculo_valor_diaria!: string;

  @IsOptional()
  @IsBoolean()
  categoria_veiculo_ativo?: boolean;

  @IsOptional()
  @IsInt()
  categoria_veiculo_status?: number;
}
