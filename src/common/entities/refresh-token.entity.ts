import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';

@Entity('refresh_tokens')
@Index('idx_refreshtokens_user', ['user'])
export class RefreshTokenEntity extends CommonEntity {
    @PrimaryColumn({ length: 36 })
    token: string; // UUID

    @ManyToOne(() => UserEntity, (user) => user.refreshTokens, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ default: false })
    is_revoked: boolean;
}
