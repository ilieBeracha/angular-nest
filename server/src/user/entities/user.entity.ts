import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, JoinColumn } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Site } from "../../site/entities/site.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty()
    first_name: string;

    @Column()
    @IsNotEmpty()
    last_name: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ select: false })
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @OneToMany(() => Site, (site) => site.user)
    @JoinColumn({ name: 'user_id' })
    sites: Site[]
}
