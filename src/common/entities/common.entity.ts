import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @Column({ nullable: true })
    created_by: number;

    @Column({ nullable: true })
    updated_by: number;

    @Column({ nullable: true })
    deleted_by: number;
}
