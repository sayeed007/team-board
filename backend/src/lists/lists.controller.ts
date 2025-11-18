import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@ApiTags('lists')
@ApiBearerAuth()
@Controller('boards/:boardId/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new list in a board' })
  create(@Param('boardId') boardId: string, @Body() createListDto: CreateListDto) {
    return this.listsService.create(boardId, createListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lists in a board' })
  findAll(@Param('boardId') boardId: string) {
    return this.listsService.findAll(boardId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update list' })
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(id, updateListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete list' })
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }
}
