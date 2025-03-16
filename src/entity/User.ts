import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

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
}
