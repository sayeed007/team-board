import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ORG_ADMIN, UserRole.SYS_ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto, @CurrentUser('organizationId') organizationId: string) {
    return this.usersService.create(createUserDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users in organization' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll(@CurrentUser('organizationId') organizationId: string) {
    return this.usersService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string, @CurrentUser('organizationId') organizationId: string) {
    return this.usersService.findOne(id, organizationId);
  }

  @Patch(':id')
  @Roles(UserRole.ORG_ADMIN, UserRole.SYS_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') requestingUserId: string,
  ) {
    return this.usersService.update(id, updateUserDto, organizationId, requestingUserId);
  }

  @Delete(':id')
  @Roles(UserRole.ORG_ADMIN, UserRole.SYS_ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') requestingUserId: string,
  ) {
    return this.usersService.remove(id, organizationId, requestingUserId);
  }
}
