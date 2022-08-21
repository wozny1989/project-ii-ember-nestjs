import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.posts)
  owner: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @RelationId((self: Post) => self.owner)
  ownerId: number;

  @RelationId((self: Post) => self.likes)
  likesIds: number[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
