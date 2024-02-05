// /pages/index.tsx
import React from 'react';
import axios from 'axios';
import { Task } from '@/models/taskTypes';
import { GetServerSideProps } from 'next';

interface HomeProps {
  tasks: Task[];
}

const Home: React.FC<HomeProps> = ({ tasks }) => {
  const [showCompleted, setShowCompleted] = React.useState<boolean>(true);

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3'>
              name
            </th>
            <th
              scope='col'
              className='px-6 py-3'>
              description
            </th>
            <th
              scope='col'
              className='px-6 py-3'>
              is_completed
            </th>
            <th
              scope='col'
              className='px-6 py-3'>
              created_at
            </th>
            <th
              scope='col'
              className='px-6 py-3'>
              updated_at
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-right'>
              <button onClick={toggleShowCompleted}>{showCompleted ? '隱藏已完成任務' : '顯示已完成任務'}</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks
            .filter((task) => showCompleted || !task.is_completed)
            .map((task) => (
              <tr
                key={task.id}
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                <th
                  scope='row'
                  className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                  {task.name}
                </th>
                <td className='px-6 py-4'>{task.description}</td>
                <td className='px-6 py-4'>{task.is_completed ? '已完成' : '未完成'}</td>
                <td className='px-6 py-4'>{task.created_at && formatDate(task.created_at)}</td>
                <td className='px-6 py-4'>{task.updated_at && formatDate(task.updated_at)}</td>
                <td className='px-6 py-4 text-right'>
                  <a
                    href='#'
                    className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>
                    編輯
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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

export default Home;
