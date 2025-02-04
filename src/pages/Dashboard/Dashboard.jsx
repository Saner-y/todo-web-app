import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTask } from "../../hooks/useTask";
import { useSearch } from "../../context/SearchContext";
import MainNavbar from "../../components/nav/MainNavbar/MainNavbar";
import SideNavbar from "../../components/nav/SideNavbar/SideNavbar";
import { TaskStatusCard } from "../../components/card/TaskStatusCard/TaskStatusCard";
import MainCard from "../../components/card/MainCard/MainCard";
import AddTask from "../AddTask/AddTask";
import { ToastContainer } from "react-toastify";
import "./Dashboard.css";
import {
  dashboardHeaderIcon,
  tasksIcon,
  completedTasksIcon,
  addIcon,
} from "../../assets/index.js";

// Bileşen parçaları
const DashboardHeader = ({ isSidebarOpen, toggleSidebar }) => (
  <>
    <MainNavbar
      headerLogo={dashboardHeaderIcon}
      toggleSidebar={toggleSidebar}
    />
    <div
      className={`sidebar-backdrop ${isSidebarOpen ? "open" : ""}`}
      onClick={() => toggleSidebar(false)}
    />
    <div className={`dashboard-page-sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="dashboard-sidebar-wrapper">
        <SideNavbar />
      </div>
    </div>
  </>
);

const SearchResults = ({ tasks, onTaskUpdate }) => {
  if (!tasks?.length) {
    return (
      <div className="no-results">
        <p>Arama sonucu bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page-search-results-cards">
      {tasks.map((task) => (
        <MainCard
          key={task.id}
          taskId={task.id}
          cardTitle={task.title}
          cardBody={task.body}
          priority={task.priority}
          status={task.status}
          createdAt={task.createdOn?.toDate().toLocaleDateString()}
          image={task.image}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  );
};

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
          taskId={doc.id}
          status={doc.data().status}
          priority={doc.data().priority}
          cardBody={doc.data().body}
          cardTitle={doc.data().title}
          createdAt={doc.data().createdOn?.toDate().toLocaleDateString()}
          image={doc.data().image}
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
          taskId={doc.id}
          status={doc.data().status}
          priority={doc.data().priority}
          cardBody={doc.data().body}
          cardTitle={doc.data().title}
          createdAt={doc.data().createdOn?.toDate().toLocaleDateString()}
          image={doc.data().image}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [state, setState] = useState({
    isSidebarOpen: false,
    completedTasks: null,
    todaysTasks: null,
    userDetails: null,
    statusPercentage: { completed: 0, inProgress: 0, notStarted: 0 },
    tasks: [],
    isAddTaskDialogOpen: false,
  });

  const { currentUser } = useAuth();
  const {
    loading,
    getCompletedTasks,
    getTodaysTasks,
    calculateTaskStats,
    getAllTasks,
  } = useTask();
  const { searchTerm, isSearchActive } = useSearch();

  const filteredTasks = useMemo(() => {
    if (!isSearchActive || !searchTerm) return [];

    const allTasks = state.tasks.map((task) => {
      const data = task.data();
      return {
        id: task.id,
        ...data,
        createdOn: data.createdOn, // Timestamp objesi olarak bırak
      };
    });

    return allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [state.tasks, searchTerm, isSearchActive]);

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
        userDetails: currentUser?.displayName,
      }));
    } catch (error) {
      console.error("Dashboard data loading error:", error);
      toast.error("Veriler yüklenirken hata oluştu");
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

  const toggleSidebar = (value) => {
    setState((prev) => ({
      ...prev,
      isSidebarOpen: value ?? !prev.isSidebarOpen,
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <circle className="loading-circle" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-body">
        <DashboardHeader
          isSidebarOpen={state.isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="dashboard-page-content">
          <h1 className="dashboard-page-content-welcome-back">
            Welcome back, {state.userDetails}
          </h1>

          <div className="dashboard-page-content-cards">
            {isSearchActive ? (
              <SearchResults
                tasks={filteredTasks}
                onTaskUpdate={refreshDashboard}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        <ToastContainer />

        {state.isAddTaskDialogOpen && (
          <div
            className="dialog-overlay"
            onClick={() =>
              setState((prev) => ({ ...prev, isAddTaskDialogOpen: false }))
            }
          >
            <div
              className="dialog-content"
              onClick={(e) => e.stopPropagation()}
            >
              <AddTask onClose={() => setState((prev) => ({ ...prev, isAddTaskDialogOpen: false }))} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
