import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Task } from '@/models/taskTypes';
import { GetServerSideProps } from 'next';

interface HomeProps {
  tasks: Task[];
}

const Home: React.FC<HomeProps> = (props) => {
  const [tasks, setTasks] = useState<Task[]>(props.tasks);

  const [taskName, setTaskName] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showCompleted, setShowCompleted] = React.useState<boolean>(true);

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!taskName || !taskDescription) {
      setError('請填寫欄位');
      return;
    }

    try {
      const response = await axios.post('https://wayi.league-funny.com/api/task', {
        name: taskName,
        description: taskDescription,
        is_completed: false,
      });

      if (response.status === 200 && response.data) {
        const newTask = response.data.data;
        setTasks((currentTasks) => [...currentTasks, newTask]);

        setTaskName('');
        setTaskDescription('');
        setError('');
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      setError('新增任務失敗');
    }
  };

  return (
    <div className='max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16'>
      <div className='px-4 py-2 flex'>
        <h1 className='text-gray-800 font-bold text-2xl uppercase'>To-Do List</h1>{' '}
        <button
          className='ml-2'
          onClick={toggleShowCompleted}>
          {showCompleted ? '隱藏已完成任務' : '顯示已完成任務'}
        </button>
      </div>
      <form
        onSubmit={handleAddTask}
        className='w-full max-w-sm mx-auto px-4 py-2'>
        <div className='flex items-center border-b-2 border-teal-500 py-2'>
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none'
            type='text'
            placeholder='新增待辦任務'
          />
          <input
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            type='text'
            placeholder='新增任務描述'
            className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none'
          />
          <button
            className='flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded'
            type='submit'>
            新增
          </button>
        </div>
        {error && <p className='bg-red-500 my-2 rounded-md text-white pl-2'>{error}</p>}
        {showSuccessMessage && <p className='bg-green-500 my-2 rounded-md text-white pl-2'>新增成功</p>}
      </form>
      <ul className='divide-y divide-gray-200 px-4'>
        {tasks
          .filter((task) => showCompleted || !task.is_completed)
          .map((task) => (
            <li className='py-4'>
              <div className='flex items-center'>
                <input
                  key={task.id}
                  name={task.name}
                  type='checkbox'
                  className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                />
                <label
                  htmlFor={task.name}
                  className='ml-3 text-gray-900 flex flex-col'>
                  <span className='text-lg font-medium'>id: {task.id}</span>
                  <span className='text-lg font-medium'>name: {task.name}</span>
                  <span className='text-lg font-medium'>description: {task.description}</span>
                  <span className='text-lg font-medium'>is_completed: {task.is_completed ? '已完成' : '未完成'}</span>
                  <span className='text-sm font-light text-gray-500'>
                    created_at: {task.created_at && formatDate(task.created_at)}
                  </span>
                  <span className='text-sm font-light text-gray-500'>
                    updated_at: {task.updated_at && formatDate(task.updated_at)}
                  </span>
                </label>
              </div>
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

export default Home;
