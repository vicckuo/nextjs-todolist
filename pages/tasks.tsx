import React from 'react';
import axios from 'axios';
import { Task } from '@/models/taskTypes';
import { GetServerSideProps } from 'next';

interface TasksProps {
  tasks: Task[];
}

const Tasks: React.FC<TasksProps> = ({ tasks }) => {
  const [showCompleted, setShowCompleted] = React.useState<boolean>(true);

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <div>
      <button onClick={toggleShowCompleted}>{showCompleted ? '隱藏已完成的任務' : '顯示已完成的任務'}</button>
      <ul>
        {tasks
          .filter((task) => showCompleted || !task.is_completed)
          .map((task) => (
            <li key={task.id}>
              {task.name} - {task.is_completed ? '已完成' : '未完成'}
            </li>
          ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const fetchAllTasks = async () => {
    let allTasks: Task[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await axios.get(`https://wayi.league-funny.com/api/task?page=${page}`);
        allTasks = allTasks.concat(response.data.data);
        page++;
        hasMore = response.data.data.length > 0;
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        break;
      }
    }

    return allTasks;
  };

  const tasks = await fetchAllTasks();

  return {
    props: {
      tasks,
    },
  };
};

export default Tasks;
