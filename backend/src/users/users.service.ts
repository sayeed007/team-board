import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, organizationId: string) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        name: createUserDto.name,
        role: createUserDto.role || 'EMPLOYEE',
        position: createUserDto.position,
        organizationId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        position: true,
        status: true,
        organizationId: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll(organizationId: string) {
    return this.prisma.user.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        position: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        position: true,
        avatarUrl: true,
        status: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    organizationId: string,
    requestingUserId: string,
  ) {
    const user = await this.findOne(id, organizationId);

    // Prevent users from changing their own role (unless they're SYS_ADMIN)
    const requestingUser = await this.prisma.user.findUnique({ where: { id: requestingUserId } });
    if (id === requestingUserId && updateUserDto.role && requestingUser?.role !== 'SYS_ADMIN') {
      throw new ForbiddenException('You cannot change your own role');
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        position: true,
        avatarUrl: true,
        status: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async remove(id: string, organizationId: string, requestingUserId: string) {
    const user = await this.findOne(id, organizationId);

    // Prevent users from deleting themselves
    if (id === requestingUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: new Date() },
    });

    return { message: 'User deleted successfully' };
  }
}
