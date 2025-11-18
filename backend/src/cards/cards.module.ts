import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController, CardsDetailController } from './cards.controller';

@Module({
  controllers: [CardsController, CardsDetailController],
  providers: [CardsService],
})
export class CardsModule {}
