import { Module } from '@nestjs/common';
import { VeiculosController } from './veiculos.controller.js';
import { VeiculosService } from './veiculos.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [VeiculosController],
  providers: [VeiculosService, PrismaService],
})
export class VeiculosModule {}