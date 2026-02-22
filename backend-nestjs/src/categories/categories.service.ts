import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category> {
    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      userId,
    });
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(userId: string): Promise<Category[]> {
    return await this.categoryRepository.find({ where: { userId } });
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.categoryRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Category not found or you do not have permission to delete it`);
    }
  }
}
