// models/taskTypes.ts 或在相應的位置
export interface Task {
  id: number;
  name: string;
  description: string;
  is_completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}
