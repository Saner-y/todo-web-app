import { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSelectedDateTasksActive, setIsSelectedDateTasksActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const value = {
    selectedDateTasks,
    setSelectedDateTasks,
    selectedDate,
    setSelectedDate,
    isSelectedDateTasksActive,
    setIsSelectedDateTasksActive,
    selectedTask,
    setSelectedTask
  };


  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );

}

export function useTasks() {
  return useContext(TaskContext);
} 