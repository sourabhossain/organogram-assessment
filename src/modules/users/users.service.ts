import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepo: Repository<UserEntity>
    ) {}

    async findByUsername(username: string): Promise<UserEntity | undefined> {
        const user = await this.usersRepo.findOne({
            where: { username },
            relations: ['roles']
        });

        return user ?? undefined;
    }
}
