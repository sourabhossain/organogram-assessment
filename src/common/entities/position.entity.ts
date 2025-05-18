import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('position')
export class PositionEntity extends CommonEntity {
    @Column({ length: 100 })
    name: string;

    @ManyToOne(() => PositionEntity, (position) => position.children, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent: PositionEntity | null;

    @OneToMany(() => PositionEntity, (position) => position.parent)
    children: PositionEntity[];
}
