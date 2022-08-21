import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  photoURL: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Post, (post) => post.owner)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @RelationId((self: User) => self.posts)
  postsIds: number[];

  @RelationId((self: User) => self.likes)
  likesIds: number[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
