import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                type: cfg.get<'mysql'>('DB_TYPE'),
                host: cfg.get<string>('DB_HOST'),
                port: cfg.get<number>('DB_PORT'),
                username: cfg.get<string>('DB_USER'),
                password: cfg.get<string>('DB_PASS'),
                database: cfg.get<string>('DB_NAME'),
                entities: [UserEntity, RoleEntity, PositionEntity, EmployeeEntity, RefreshTokenEntity, AuditLog],
                synchronize: cfg.get<string>('NODE_ENV') !== 'production'
            })
        }),
        AuthModule,
        EmployeeModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
