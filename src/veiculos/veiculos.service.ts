
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto.js';
import { CriarCategoriaDto } from './dto/criar-categoria.dto.js';
import { AtualizarQuilometragemDto } from './dto/atualizar-quilometragem.dto.js';

@Injectable()
export class VeiculosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar_veiculo() {
    const veiculos = await this.prisma.veiculo.findMany();

    return veiculos.map((veiculo) => ({
      ...veiculo,
      veiculo_id: veiculo.veiculo_id.toString(),
      categoria_veiculo_id: veiculo.categoria_veiculo_id.toString(),
    }));
  }

  async cadastrar_veiculo(dados: CriarVeiculoDto) {
    const categoriaId = BigInt(dados.categoria_veiculo_id);

    const categoria = await this.prisma.categoria_veiculo.findUnique({
      where: { categoria_veiculo_id: categoriaId },
    });

    if (!categoria) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const agora = new Date();

    try {
      const veiculo = await this.prisma.veiculo.create({
        data: {
          categoria_veiculo_id: categoriaId,
          veiculo_placa: dados.veiculo_placa.trim().toUpperCase(),
          veiculo_marca: dados.veiculo_marca,
          veiculo_modelo: dados.veiculo_modelo,
          veiculo_ano_fabricacao: dados.veiculo_ano_fabricacao,
          veiculo_ano_modelo: dados.veiculo_ano_modelo,
          veiculo_cor: dados.veiculo_cor,
          veiculo_quilometragem: dados.veiculo_quilometragem ?? 0,
          veiculo_criado: agora,
          veiculo_atualizado: agora,
          veiculo_status: dados.veiculo_status,
        },
      });

      return {
        ...veiculo,
        veiculo_id: veiculo.veiculo_id.toString(),
        categoria_veiculo_id: veiculo.categoria_veiculo_id.toString(),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Placa já cadastrada.');
      }
      throw error;
    }
  }


    async listar_categorias() {
    const categorias = await this.prisma.categoria_veiculo.findMany({
        select: {
        categoria_veiculo_id: true,
        categoria_veiculo_nome: true,
        categoria_veiculo_ativo: true,
        categoria_veiculo_status: true,
        },
    });

    return categorias.map((categoria) => ({
        ...categoria,
        categoria_veiculo_id:
        categoria.categoria_veiculo_id.toString(),
    }));
    }

    async cadastrar_categoria(dados: CriarCategoriaDto) {
    const categoria = await this.prisma.categoria_veiculo.create({
        data: {
        categoria_veiculo_nome: dados.categoria_veiculo_nome,
        categoria_veiculo_descricao: dados.categoria_veiculo_descricao,
        categoria_veiculo_valor_diaria: dados.categoria_veiculo_valor_diaria,
        categoria_veiculo_ativo: dados.categoria_veiculo_ativo ?? true,
        categoria_veiculo_status: dados.categoria_veiculo_status,
        },
    });

    return {
        ...categoria,
        categoria_veiculo_id: categoria.categoria_veiculo_id.toString(),
    };
    }

    async atualizar_quilometragem(
    id: string,
    dados: AtualizarQuilometragemDto,
    ) {
    // 1. Validar o ID recebido
    if (!/^[1-9]\d*$/.test(id)) {
        throw new BadRequestException('ID inválido.');
    }

    const veiculoId = BigInt(id);

    // 2. Buscar o veículo no banco
    const veiculo = await this.prisma.veiculo.findUnique({
        where: {
        veiculo_id: veiculoId,
        },
    });

    // 3. Verificar se o veículo existe
    if (!veiculo) {
        throw new NotFoundException('Veículo não encontrado.');
    }

    // 4. Validar a nova quilometragem
    if (
        dados.veiculo_quilometragem <
        veiculo.veiculo_quilometragem
    ) {
        throw new BadRequestException(
        'A nova quilometragem não pode ser menor que a atual.',
        );
    }

    // 5. Atualizar no banco de dados
    const veiculoAtualizado = await this.prisma.veiculo.update({
        where: {
        veiculo_id: veiculoId,
        },
        data: {
        veiculo_quilometragem: dados.veiculo_quilometragem,
        veiculo_atualizado: new Date(),
        },
    });

    // 6. Retornar o veículo atualizado
    return {
        ...veiculoAtualizado,
        veiculo_id: veiculoAtualizado.veiculo_id.toString(),
        categoria_veiculo_id:
        veiculoAtualizado.categoria_veiculo_id.toString(),
    };
    }

    async desativar_veiculo(id: string) {
    // Validar o ID
    if (!/^[1-9]\d*$/.test(id)) {
        throw new BadRequestException('ID inválido.');
    }

    const veiculoId = BigInt(id);

    // Buscar o veículo
    const veiculo = await this.prisma.veiculo.findUnique({
        where: { veiculo_id: veiculoId },
    });

    if (!veiculo) {
        throw new NotFoundException('Veículo não encontrado.');
    }

    // Verificar se já está inativo
    if (veiculo.veiculo_status === 0) {
        return {
        mensagem: 'Veículo já está inativo.',
        };
    }

    // Atualizar status para inativo
    await this.prisma.veiculo.update({
        where: { veiculo_id: veiculoId },
        data: {
        veiculo_status: 0,
        veiculo_atualizado: new Date(),
        },
    });

    return {
        mensagem: 'Veículo desativado com sucesso.',
        veiculo_id: id,
        veiculo_status: 0,
    };
    }
}
