import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';

@Entity('audit_log')
@Index('idx_auditlog_user', ['user'])
export class AuditLog extends CommonEntity {
    @ManyToOne(() => UserEntity, (user) => user.auditLogs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity | null;

    @Column({ type: 'varchar', length: 100 })
    action: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    target_type: string | null;

    @Column({ type: 'int', nullable: true })
    target_id: number | null;

    @CreateDateColumn({ type: 'datetime' })
    timestamp: Date;

    @Column({ type: 'text', nullable: true })
    details: string | null;
}
