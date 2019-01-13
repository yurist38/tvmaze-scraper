import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Actor {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public actorId!: number;

  @Column()
  public name!: string;

  @Column({ nullable: true })
  public birthday?: string;
}

export default Actor;
