import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { UsersModule } from './modules/users/users.module';
import { UserEntity } from './common/entities/user.entity';
import { RoleEntity } from './common/entities/role.entity';
import { PositionEntity } from './common/entities/position.entity';
import { EmployeeEntity } from './common/entities/employee.entity';
import { AuditLog } from './common/entities/audit-log.entity';
import { RefreshTokenEntity } from './common/entities/refresh-token.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),

        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: process.env.SYNCHRONIZE === 'true',
            entities: [UserEntity, RoleEntity, PositionEntity, EmployeeEntity, RefreshTokenEntity, AuditLog],
            extra: {
                charset: 'utf8_general_ci'
            }
        }),
        AuthModule,
        EmployeeModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
