import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    providerId?: string;

    @Column({ nullable: true })
    provider?: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    role!: UserRole;

    @Column({ default: false })
    isVerified!: boolean;
}
