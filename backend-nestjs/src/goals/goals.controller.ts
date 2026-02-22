import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new savings goal' })
  create(@Body() createGoalDto: CreateGoalDto, @Request() req: any) {
    return this.goalsService.create(createGoalDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user goals' })
  findAll(@Request() req: any) {
    return this.goalsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific goal' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.goalsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal (e.g., add savings)' })
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @Request() req: any) {
    return this.goalsService.update(id, updateGoalDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.goalsService.remove(id, req.user.id);
  }
}
