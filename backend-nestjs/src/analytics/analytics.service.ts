import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { CategoryType } from '../categories/entities/category.entity';

@Injectable()
export class AnalyticsService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async getDashboardSummary(userId: string, year: number, month: number) {
    const transactions = await this.transactionsService.findByMonth(userId, year, month);

    let totalIncome = 0;
    let totalExpense = 0;

    // Junior note: In a real large scale app, you might want to do this aggregation using SQL queries 
    // rather than doing it in memory, but this is fine for small/medium amount of transactions per month.
    transactions.forEach(t => {
      // Type casting because postgres numeric returns string in TypeORM
      const amount = Number(t.amount); 
      if (t.category?.type === CategoryType.INCOME) {
        totalIncome += amount;
      } else if (t.category?.type === CategoryType.EXPENSE) {
        totalExpense += amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }
}
