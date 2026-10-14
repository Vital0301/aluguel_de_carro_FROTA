
import { IsInt, Min } from 'class-validator';

export class AtualizarQuilometragemDto {
  @IsInt()
  @Min(0)
  veiculo_quilometragem!: number;
}
