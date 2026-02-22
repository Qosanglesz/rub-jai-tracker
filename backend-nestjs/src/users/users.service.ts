import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Find a user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Find a user by ID.
   */
  async findById(id: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new InternalServerErrorException('Error retrieving user data');
    }
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  /**
   * Create a new user.
   */
  async create(userParams: Partial<User>): Promise<User> {
    try {
      const newUser = this.usersRepository.create(userParams);
      return await this.usersRepository.save(newUser);
    } catch (error: any) {
      // Postgres unique violation error code is 23505
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
