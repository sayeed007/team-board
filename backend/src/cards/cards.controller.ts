import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('cards')
@ApiBearerAuth()
@Controller('boards/:boardId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  create(
    @Param('boardId') boardId: string,
    @Body() createCardDto: CreateCardDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.cardsService.create(boardId, createCardDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards in a board' })
  findAll(@Param('boardId') boardId: string) {
    return this.cardsService.findAll(boardId);
  }
}

@ApiTags('cards')
@ApiBearerAuth()
@Controller('cards')
export class CardsDetailController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get card by ID with comments and activity' })
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update card' })
  update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.cardsService.update(id, updateCardDto, userId);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move card to another list' })
  move(@Param('id') id: string, @Body() moveCardDto: MoveCardDto, @CurrentUser('id') userId: string) {
    return this.cardsService.move(id, moveCardDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete card' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.cardsService.remove(id, userId);
  }
}
