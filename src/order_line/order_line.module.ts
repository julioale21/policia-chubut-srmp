import { Module } from '@nestjs/common';
import { OrderLineService } from './order_line.service';
import { OrderLineController } from './order_line.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLine } from './entities/order_line.entity';

@Module({
  controllers: [OrderLineController],
  providers: [OrderLineService],
  imports: [TypeOrmModule.forFeature([OrderLine])],
  exports: [OrderLineService],
})
export class OrderLineModule {}
