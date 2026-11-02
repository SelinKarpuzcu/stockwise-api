import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('An account with this email already exists.'); // HTTP 409 Conflict
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if(!user){
            throw new UnauthorizedException('Invalid email or password.'); // HTTP 401 Unauthorized
        }

        const passwordMatches = await bcrypt.compare(
            loginDto.password,
            user.passwordHash,
        );

        if(!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password.'); // HTTP 401 Unauthorized
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return {
            access_token: accessToken,
        };
    }
}
