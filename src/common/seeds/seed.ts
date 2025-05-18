import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../entities/role.entity';
import { UserEntity } from '../entities/user.entity';
import { PositionEntity } from '../entities/position.entity';
import { EmployeeEntity } from '../entities/employee.entity';

async function runSeed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const ds = app.get(DataSource);

    const roleRepo = ds.getRepository(RoleEntity);
    const userRepo = ds.getRepository(UserEntity);
    const posRepo = ds.getRepository(PositionEntity);
    const empRepo = ds.getRepository(EmployeeEntity);

    // 1) Roles
    const roles = ['Admin', 'Manager', 'User'].map((name) =>
        roleRepo.create({
            name,
            description:
                name === 'Admin'
                    ? 'Administrator with full access'
                    : name === 'Manager'
                      ? 'Manager of a team'
                      : 'Regular user'
        })
    );
    await roleRepo.save(roles);

    // 2) Positions
    const cto = await posRepo.save(posRepo.create({ name: 'CTO' }));
    const senior = await posRepo.save(posRepo.create({ name: 'Senior Software Eng', parent: cto }));
    const eng = await posRepo.save(posRepo.create({ name: 'Software Eng', parent: senior }));

    // 3) Employees
    const alice = empRepo.create({
        full_name: 'Alice Manager',
        position: senior,
        email: 'alice@example.com',
        phone: '01711111111',
        hired_date: '2023-04-01'
    });
    const bob = empRepo.create({
        full_name: 'Bob Developer',
        position: eng,
        email: 'bob@example.com',
        phone: '01722222222',
        hired_date: '2024-02-15'
    });
    await empRepo.save([alice, bob]);

    // 4) Users
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync('password123', salt);

    const userAlice = userRepo.create({
        employee: alice,
        username: 'alice',
        password_hash: passHash,
        is_active: true
    });

    const userBob = userRepo.create({
        employee: bob,
        username: 'bob',
        password_hash: passHash,
        is_active: true
    });

    await userRepo.save([userAlice, userBob]);

    // 5) Assign Roles
    await ds.createQueryBuilder().relation(UserEntity, 'roles').of(userAlice).add([roles[0].id, roles[1].id]); // Admin, Manager
    await ds.createQueryBuilder().relation(UserEntity, 'roles').of(userBob).add(roles[2].id); // User

    console.info('✅ Seeding complete');
    await app.close();
}

runSeed().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
