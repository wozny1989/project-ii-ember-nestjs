import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
    const newLike = this.likesRepository.create(createLikeDto);

    await this.likesRepository.save(newLike);
    return newLike;
  }

  async findAll(query: FindManyOptions) {
    return await this.likesRepository.find(query);
  }

  async findOne(id: number) {
    return await this.likesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateLikeDto: UpdateLikeDto) {
    await this.likesRepository.update(id, updateLikeDto);
    const updatedLike = await this.likesRepository.findOne({ where: { id } });
    return updatedLike;
  }

  async remove(id: number) {
    return await this.likesRepository.delete(id);
  }
}
