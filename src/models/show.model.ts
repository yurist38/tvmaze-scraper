import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Actor from './actor.model';

@Entity()
class Show {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({ unique: true })
    public showId!: number;

    @Column()
    public name!: string;

    @ManyToMany((type) => Actor, (actor) => actor, { eager: true })
    @JoinTable({
      inverseJoinColumn: {
        name: 'actor',
        referencedColumnName: 'actorId',
      },
      joinColumn: {
        name: 'show',
        referencedColumnName: 'showId',
      },
      name: 'show_actors',
    })
    public cast!: Actor[];
}

export default Show;
