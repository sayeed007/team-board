import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(UserRole.ORG_ADMIN, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'Create a new team' })
  create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.teamsService.create(createTeamDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  findAll(@CurrentUser('organizationId') organizationId: string) {
    return this.teamsService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID' })
  findOne(@Param('id') id: string, @CurrentUser('organizationId') organizationId: string) {
    return this.teamsService.findOne(id, organizationId);
  }

  @Patch(':id')
  @Roles(UserRole.ORG_ADMIN, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'Update team' })
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.teamsService.update(id, updateTeamDto, organizationId);
  }

  @Delete(':id')
  @Roles(UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Delete team' })
  remove(@Param('id') id: string, @CurrentUser('organizationId') organizationId: string) {
    return this.teamsService.remove(id, organizationId);
  }

  @Post(':id/members')
  @Roles(UserRole.ORG_ADMIN, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'Add member to team' })
  addMember(
    @Param('id') teamId: string,
    @Body() addMemberDto: AddMemberDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.teamsService.addMember(teamId, addMemberDto.userId, organizationId);
  }

  @Delete(':id/members/:userId')
  @Roles(UserRole.ORG_ADMIN, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'Remove member from team' })
  removeMember(
    @Param('id') teamId: string,
    @Param('userId') userId: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.teamsService.removeMember(teamId, userId, organizationId);
  }
}
