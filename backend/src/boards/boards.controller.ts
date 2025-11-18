import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('boards')
@ApiBearerAuth()
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  create(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.boardsService.create(createBoardDto, organizationId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  findAll(@CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    return this.boardsService.findAll(organizationId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get board by ID with lists and cards' })
  findOne(@Param('id') id: string, @CurrentUser('organizationId') organizationId: string) {
    return this.boardsService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update board' })
  update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.boardsService.update(id, updateBoardDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete board' })
  remove(@Param('id') id: string, @CurrentUser('organizationId') organizationId: string) {
    return this.boardsService.remove(id, organizationId);
  }
}
