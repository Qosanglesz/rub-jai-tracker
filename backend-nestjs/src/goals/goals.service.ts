import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalsRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto, userId: string): Promise<Goal> {
    const newGoal = this.goalsRepository.create({
      ...createGoalDto,
      userId,
    });
    return await this.goalsRepository.save(newGoal);
  }

  async findAll(userId: string): Promise<Goal[]> {
    return await this.goalsRepository.find({
      where: { userId },
      order: { deadline: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalsRepository.findOne({ where: { id, userId } });
    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, userId: string): Promise<Goal> {
    const goal = await this.findOne(id, userId);
    
    // Process add savings logic safely
    if (updateGoalDto.currentAmount !== undefined) {
      // In this app, we let users update their currentAmount explicitly 
      // It can be more complex (e.g., tying transactions directly to goals)
    }

    const updated = this.goalsRepository.merge(goal, updateGoalDto);
    return await this.goalsRepository.save(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.goalsRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
  }
}
