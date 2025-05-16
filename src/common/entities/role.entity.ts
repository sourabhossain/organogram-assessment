import { Column, Entity, ManyToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity extends CommonEntity {
    @Column({ length: 50, unique: true })
    name: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];
}
