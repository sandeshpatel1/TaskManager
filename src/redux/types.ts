// src/types.ts or at the top of TaskForm.tsx and TaskList.tsx
export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'in-progress' | 'completed';
  }
  