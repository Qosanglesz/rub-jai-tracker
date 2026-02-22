import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req: any) {
    return this.transactionsService.create(createTransactionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user transactions' })
  findAll(@Request() req: any) {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get user transactions by month' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  findByMonth(
    @Request() req: any,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.transactionsService.findByMonth(req.user.id, year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Request() req: any) {
    return this.transactionsService.update(id, updateTransactionDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.remove(id, req.user.id);
  }
}
