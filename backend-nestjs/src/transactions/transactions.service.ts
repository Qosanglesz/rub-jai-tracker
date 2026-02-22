import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      userId,
    });
    return await this.transactionsRepository.save(transaction);
  }

  async findAll(userId: string): Promise<Transaction[]> {
    // Junior note: Always scope queries by userId to prevent data leakage between users
    return await this.transactionsRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findByMonth(userId: string, year: number, month: number): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    return await this.transactionsRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);
    
    // Merge new values
    const updated = this.transactionsRepository.merge(transaction, updateTransactionDto);
    return await this.transactionsRepository.save(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.transactionsRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}
