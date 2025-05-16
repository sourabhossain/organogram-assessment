import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('users')
export class UserEntity extends CommonEntity {
    @Column({ type: String, nullable: false })
    first_name: string;

    @Column({ type: String, nullable: false })
    last_name: string;

    @Column({ type: String, nullable: false })
    email: string;
}
