
import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';

import { VeiculosService } from './veiculos.service.js';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto.js';
import { CriarCategoriaDto } from './dto/criar-categoria.dto.js';
import { AtualizarQuilometragemDto } from './dto/atualizar-quilometragem.dto.js';

@Controller('veiculos')
export class VeiculosController {
  constructor(
    private readonly veiculosService: VeiculosService,
  ) {}

  @Get()
  listar_veiculo() {
    return this.veiculosService.listar_veiculo();
  }

  @Post()
  cadastrar_veiculo(@Body() dados: CriarVeiculoDto) {
    return this.veiculosService.cadastrar_veiculo(dados);
  }

  @Get('categorias')
  listar_categorias() {
    return this.veiculosService.listar_categorias();
  }

  @Post('categorias')
  cadastrar_categoria(@Body() dados: CriarCategoriaDto) {
    return this.veiculosService.cadastrar_categoria(dados);
  }

  @Patch(':id/quilometragem')
  atualizar_quilometragem(
    @Param('id') id: string,
    @Body() dados: AtualizarQuilometragemDto,
  ) {
    return this.veiculosService.atualizar_quilometragem(
      id,
      dados,
    );
  }

  @Delete(':id')
  desativar_veiculo(@Param('id') id: string) {
    return this.veiculosService.desativar_veiculo(id);
  }
}
