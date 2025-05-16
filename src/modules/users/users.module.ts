import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserEntity } from 'src/common/entities/user.entity';
import { RoleEntity } from 'src/common/entities/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
