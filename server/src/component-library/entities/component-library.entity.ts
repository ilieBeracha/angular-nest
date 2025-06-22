import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class ComponentLibrary {
    /* ------------------------------------------------------------------ */
    /*  Primary key                                                       */
    /* ------------------------------------------------------------------ */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    display_name: string;      // human-friendly title

    @Column({ nullable: true })
    preview_url?: string;      // thumbnail shown in picker

    @Column({ nullable: true })
    category?: string;         // Hero / Marketing / …

    @Column({ type: 'jsonb', default: () => "'{}'" })
    props_schema: Record<string, any>;

    @Column({ default: '1.0.0' })
    version: string;

    @Column({ nullable: true })
    doc_url?: string;

    @Column({ type: 'timestamptz', default: () => 'now()' })
    created_at: Date;

}
