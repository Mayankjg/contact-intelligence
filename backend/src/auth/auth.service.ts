import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ username: name }, { email }] },
    });

    if (existing) {
      throw new ConflictException(
        existing.email === email
          ? 'An account with this email already exists'
          : 'This name is already in use',
      );
    }

    const user = await this.prisma.user.create({
      data: {
        username: name,
        firstName: name,
        lastName: '',
        email,
        passwordHash: await bcrypt.hash(dto.password, 12),
      },
    });

    return {
      success: true,
      message: 'Account created successfully. Please sign in to continue.',
      data: {
        id: user.id,
        name: user.username ?? user.firstName,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.name.trim() },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Incorrect name or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('This account is not active');
    }

    return this.buildResponse(user);
  }

  private buildResponse(user: {
    id: string; username: string | null; firstName: string; email: string; role: string;
  }) {
    const accessToken = this.jwtService.sign({ sub: user.id, role: user.role });

    return {
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.username ?? user.firstName,
          email: user.email,
          role: user.role,
        },
      },
    };
  }
}
