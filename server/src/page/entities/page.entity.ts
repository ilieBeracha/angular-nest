import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Block } from '../../block/entities/block.entity';
import { Site } from '../../site/entities/site.entity';

 export interface GridSection {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  }

@Entity()
export class Page {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    number: number;

    @Column()
    name: string;

    @Column()
    site_id: string;

    @OneToMany(() => Block, (block) => block.page, { cascade: true })
    blocks: Block[];

    @ManyToOne(() => Site, (site) => site.pages)
    @JoinColumn({ name: 'site_id' })
    site: Site;

    @Column('jsonb', { nullable: true })
    grid_layout: GridSection[];

    @Column({ default: false })
    is_default: boolean;
}

