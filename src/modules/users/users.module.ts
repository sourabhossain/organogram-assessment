import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'src/common/entities/role.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
