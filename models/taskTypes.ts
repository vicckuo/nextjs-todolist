export interface Task {
  id: number;
  name: string;
  description: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}
