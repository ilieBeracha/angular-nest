import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Page } from '../../page/entities/page.entity';
import { User } from '../../user/entities/user.entity';

export interface SiteStyle {
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  theme: string;
}

export interface SiteConfig {
  logo: string;
  favicon: string;
  styles: SiteStyle;
}

export enum SiteStatus {
  STARTING = 'starting',
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error',
}

@Entity()
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  domain: string;

  @Column({ type: 'int', unique: true })
  port: number;

  @Column()
  layout_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('jsonb', { nullable: true })
  config: Record<string, any>;

  @Column({
    type: 'enum',
    enum: SiteStatus,
    default: SiteStatus.STARTING,
  })
  status: SiteStatus;

  @OneToMany(() => Page, (page) => page.site)
  @JoinColumn({ name: 'page_id' })
  pages: Page[];

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, (user) => user.sites)
  @JoinColumn({ name: 'user_id' })
  user: User;
 
}