import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTask } from "../../hooks/useTask";
import { useSearch } from "../../context/SearchContext";
import MainNavbar from "../../components/nav/MainNavbar/MainNavbar";
import SideNavbar from "../../components/nav/SideNavbar/SideNavbar";
import { TaskStatusCard } from "../../components/card/TaskStatusCard/TaskStatusCard";
import MainCard from "../../components/card/MainCard/MainCard";
import AddTask from "../AddTask/AddTask";
import { ToastContainer, toast } from "react-toastify";
import "./Dashboard.css";
import {
  dashboardHeaderIcon,
  tasksIcon,
  completedTasksIcon,
  addIcon,
} from "../../assets/index.js";
import { useTasks } from "../../context/TaskContext";
import BaseView from "../../layouts/BaseView/BaseView.jsx";

const TodoSection = ({ todaysTasks, onAddTask, onTaskUpdate }) => (
  <div className="dashboard-page-content-todo-section">
    <div className="dashboard-page-todo-section-header">
      <div className="dashboard-page-status-card-header">
        <img src={tasksIcon} alt="tasks" />
        <h3 className="dashboard-page-card-title">To-Do</h3>
      </div>
      <label className="dashboard-header-add-new-task">
        <img src={addIcon} alt="add" />
        <button className="add-new-tasks-button" onClick={onAddTask}>
          Add New Task
        </button>
      </label>
    </div>
    <div className="dashboard-page-todo-section-date">
      <p>{new Date().toLocaleDateString()}</p>
      <circle className="dashboard-page-date-divider-circle" />
      <p>Today</p>
    </div>
    <div className="dashboard-page-todo-cards">
      {todaysTasks?.docs?.map((doc) => (
        <MainCard
          key={doc.id}
          task={doc}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  </div>
);

const CompletedTasksSection = ({ completedTasks, onTaskUpdate }) => (
  <div className="dashboard-page-completed-task-card">
    <div className="dashboard-page-completed-task-card-header">
      <img src={completedTasksIcon} alt="completed" />
      <h3 className="dashboard-page-card-title">Completed Task</h3>
    </div>
    <div className="dashboard-page-completed-task-card-body">
      {completedTasks?.docs?.map((doc) => (
        <MainCard
          key={doc.id}
          task={doc}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [state, setState] = useState({
    completedTasks: null,
    todaysTasks: null,
    statusPercentage: { completed: 0, inProgress: 0, notStarted: 0 },
    tasks: [],
    isAddTaskDialogOpen: false,
  });

  const { currentUser } = useAuth();
  const { getCompletedTasks, getTodaysTasks, calculateTaskStats, getAllTasks } =
    useTask();

  const refreshDashboard = useCallback(async () => {
    try {
      const [completedTasks, todaysTasks, statusStats, allTasks] =
        await Promise.all([
          getCompletedTasks(),
          getTodaysTasks(),
          calculateTaskStats(),
          getAllTasks(),
        ]);

      setState((prev) => ({
        ...prev,
        completedTasks,
        todaysTasks,
        statusPercentage: statusStats,
        tasks: allTasks.docs,
      }));
    } catch (error) {
      console.error("Dashboard data loading error:", error);
      toast.error("Error loading data");
    }
  }, [
    getCompletedTasks,
    getTodaysTasks,
    calculateTaskStats,
    getAllTasks,
    currentUser,
  ]);

  useEffect(() => {
    if (!currentUser) return;
    refreshDashboard();
  }, [currentUser, refreshDashboard]);

  const handleCloseDialog = useCallback(
    async (shouldRefresh = false) => {
      setState((prev) => ({ ...prev, isAddTaskDialogOpen: false }));
      if (shouldRefresh) {
        await refreshDashboard();
      }
    },
    [refreshDashboard]
  );

  return (
    <BaseView>
      <TodoSection
        todaysTasks={state.todaysTasks}
        onAddTask={() =>
          setState((prev) => ({
            ...prev,
            isAddTaskDialogOpen: true,
          }))
        }
        onTaskUpdate={refreshDashboard}
      />
      <div className="dashboard-page-status-completed-task-wrapper">
        <TaskStatusCard statusPercentage={state.statusPercentage} />
        <CompletedTasksSection
          completedTasks={state.completedTasks}
          onTaskUpdate={refreshDashboard}
        />
      </div>
      {state.isAddTaskDialogOpen && (
        <div
          className="dialog-overlay"
          onClick={() =>
            setState((prev) => ({ ...prev, isAddTaskDialogOpen: false }))
          }
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <AddTask onClose={(success) => handleCloseDialog(success)} />
          </div>
        </div>
      )}
    </BaseView>
  );
}
