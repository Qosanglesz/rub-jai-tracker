// Goal types
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  userId: string;
}

export interface CreateGoalDto {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string; // YYYY-MM-DD
}

export interface AddFundsDto {
  amount: number;
}
