import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto, organizationId: string) {
    return this.prisma.team.create({
      data: {
        ...createTeamDto,
        organizationId,
      },
      include: {
        _count: { select: { teamMembers: true, boards: true } },
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.team.findMany({
      where: { organizationId },
      include: {
        _count: { select: { teamMembers: true, boards: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id, organizationId },
      include: {
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                position: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: { select: { boards: true } },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, organizationId: string) {
    await this.findOne(id, organizationId);

    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);

    await this.prisma.team.delete({ where: { id } });

    return { message: 'Team deleted successfully' };
  }

  async addMember(teamId: string, userId: string, organizationId: string) {
    const team = await this.findOne(teamId, organizationId);

    // Check if user exists and belongs to the organization
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found in this organization');
    }

    // Check if already a member
    const existing = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId: team.id, userId },
      },
    });

    if (existing) {
      throw new ConflictException('User is already a team member');
    }

    return this.prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async removeMember(teamId: string, userId: string, organizationId: string) {
    await this.findOne(teamId, organizationId);

    const member = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId },
      },
    });

    if (!member) {
      throw new NotFoundException('User is not a team member');
    }

    await this.prisma.teamMember.delete({
      where: { id: member.id },
    });

    return { message: 'Member removed successfully' };
  }
}
