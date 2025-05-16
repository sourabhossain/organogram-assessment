// src/common/seeds/seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module'; // ← relative import
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../entities/role.entity';
import { UserEntity } from '../entities/user.entity';
import { PositionEntity } from '../entities/position.entity';
import { EmployeeEntity } from '../entities/employee.entity';

async function runSeed() {
    // Boot up the Nest context so we can get the DataSource
    const app = await NestFactory.createApplicationContext(AppModule);
    const ds = app.get(DataSource);

    // Repositories
    const roleRepo = ds.getRepository(RoleEntity);
    const userRepo = ds.getRepository(UserEntity);
    const posRepo = ds.getRepository(PositionEntity);
    const empRepo = ds.getRepository(EmployeeEntity);

    // 1) Seed Roles
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

    // 2) Seed Positions (hierarchy)
    const cto = await posRepo.save(posRepo.create({ name: 'CTO' }));
    const senior = await posRepo.save(posRepo.create({ name: 'Senior Software Eng', parent: cto }));
    const eng = await posRepo.save(posRepo.create({ name: 'Software Eng', parent: senior }));

    // 3) Seed Employees
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

    // 4) Seed Users (1:1 with employees)
    const passHash = await bcrypt.hash('password123', 10);
    const uAlice = userRepo.create({
        employee: alice,
        username: 'alice',
        password_hash: passHash,
        is_active: true
    });
    const uBob = userRepo.create({
        employee: bob,
        username: 'bob',
        password_hash: passHash,
        is_active: true
    });
    await userRepo.save([uAlice, uBob]);

    // 5) Assign Roles to Users
    // Alice → Admin + Manager, Bob → User
    await ds.createQueryBuilder().relation(UserEntity, 'roles').of(uAlice).add([roles[0].id, roles[1].id]);
    await ds.createQueryBuilder().relation(UserEntity, 'roles').of(uBob).add(roles[2].id);

    console.log('✅ Seeding complete');
    await app.close();
}

runSeed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
