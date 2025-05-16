import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { JWT_EXPIRES_IN, JWT_SECRET } from 'src/common/configs/config';
import { UserEntity } from 'src/common/entities/user.entity';

interface JwtPayload {
    username: string;
    sub: number;
    roles: string[];
}

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async validateUser(username: string, password: string): Promise<Omit<UserEntity, 'password_hash'> | null> {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return null;
        }

        const { password_hash: _password_hash, ...result } = user;

        return result as Omit<UserEntity, 'password_hash'>;
    }

    login(user: Omit<UserEntity, 'password_hash'>): { accessToken: string } {
        const payload: JwtPayload = {
            username: user.username,
            sub: user.id,
            roles: user.roles?.map((role) => role.name) || []
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return { accessToken };
    }
}
