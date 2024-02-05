import React, { useState } from 'react';
import { Task } from '@/models/taskTypes';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (id: number, name: string, description: string) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave }) => {
  const [name, setName] = useState<string>(task.name);
  const [description, setDescription] = useState<string>(task.description);
  const [error, setError] = useState<string>('');

  const validateForm = () => {
    if (!name.trim() || !description.trim()) {
      setError('請填寫欄位');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(task.id, name, description);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='taskName'
              className='block text-sm font-medium text-gray-700'>
              任務名稱
            </label>
            <input
              type='text'
              id='taskName'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              required
            />
          </div>
          <div className='mt-4'>
            <label
              htmlFor='taskDescription'
              className='block text-sm font-medium text-gray-700'>
              任務描述
            </label>
            <textarea
              id='taskDescription'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              required
            />
          </div>
          {error && <div className='my-2 text-red-500'>{error}</div>}
          <div className='mt-4 flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded'>
              取消
            </button>
            <button
              type='submit'
              className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
