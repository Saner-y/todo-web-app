import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTask } from "../../hooks/useTask";
import { useSearch } from "../../context/SearchContext";
import MainNavbar from "../../components/nav/MainNavbar/MainNavbar";
import SideNavbar from "../../components/nav/SideNavbar/SideNavbar";
import MainCard from "../../components/card/MainCard/MainCard";
import { ToastContainer, toast } from "react-toastify";
import "./BaseView.css";
import { dashboardHeaderIcon, tasksIcon, addIcon } from "../../assets/index.js";
import { useTasks } from "../../context/TaskContext";

const BaseViewHeader = ({ isSidebarOpen, toggleSidebar }) => (
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
          task={task}
          onTaskUpdate={onTaskUpdate}
        />

      ))}
    </div>
  );
};

const SelectedDateTasks = ({ tasks, selectedDate, onTaskUpdate }) => {
  if (!tasks?.length) {
    return (
      <div className="no-results">
        <p>No tasks for {selectedDate?.toLocaleDateString()}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page-content-todo-section">
      <div className="dashboard-page-todo-section-header">
        <div className="dashboard-page-status-card-header">
          <img src={tasksIcon} alt="tasks" />
          <h3 className="dashboard-page-card-title">
            Tasks for {selectedDate?.toLocaleDateString()}
          </h3>
        </div>
      </div>
      <div className="dashboard-page-todo-cards">
        {tasks.map((task) => (
          <MainCard
            key={task.id}
            task={task}
            onTaskUpdate={onTaskUpdate}
          />

        ))}
      </div>
    </div>
  );
};

export default function BaseView({ children }) {
    const [state, setState] = useState({
        isSidebarOpen: false,
        tasks: [],
        username: null,
        selectedDateTasks: [],
      });
    
      const { currentUser, returnUsername } = useAuth();
      const {
        loading,
        getCompletedTasks,
        getTodaysTasks,
        calculateTaskStats,
        getAllTasks,
      } = useTask();
      const { searchTerm, isSearchActive } = useSearch();
      const { isSelectedDateTasksActive, selectedDate, selectedDateTasks, setSelectedDateTasks } = useTasks();
    
      const filterTasksByDate = useCallback((tasks, targetDate) => {
        if (!targetDate || !tasks?.length) return [];
        
        // Seçilen tarihi UTC'ye çevirip gün başlangıcına ayarla
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        // Gün sonunu ayarla
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
    
        return tasks.filter(task => {
          const taskDate = task.data().assignedOn?.toDate();
          if (!taskDate) return false;
          
          // Timestamp'i locale çevir ve karşılaştır
          const localTaskDate = new Date(taskDate);
          return localTaskDate >= startOfDay && localTaskDate <= endOfDay;
        });
      }, []);
    
    
      const filteredTasks = useMemo(() => {
        if (!isSearchActive || !searchTerm) return [];
    
        const allTasks = state.tasks.map((task) => {
          const data = task.data();
          return {
            id: task.id,
            ...data,
            assignedOn: data.assignedOn,
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
    
          const username = await returnUsername();
          
          // Filter tasks for selected date if active
          if (selectedDate) {
            const filteredDateTasks = filterTasksByDate(allTasks.docs, selectedDate);
            setSelectedDateTasks(filteredDateTasks.map(doc => ({
              id: doc.id,
              ...doc.data(),
              assignedOn: doc.data().assignedOn?.toDate().toLocaleDateString()
            })));
          }
    
          setState((prev) => ({
            ...prev,
            completedTasks,
            todaysTasks,
            statusPercentage: statusStats,
            tasks: allTasks.docs,
            userDetails: currentUser?.displayName,
            username: username,
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
        selectedDate,
        filterTasksByDate,
        setSelectedDateTasks
      ]);
    
      useEffect(() => {
        if (!currentUser) return;
        refreshDashboard();
      }, [currentUser, refreshDashboard]);
    
      // Update when selected date changes
      useEffect(() => {
        if (selectedDate && state.tasks.length > 0 ) {
          const filteredDateTasks = filterTasksByDate(state.tasks, selectedDate);
          setSelectedDateTasks(filteredDateTasks.map(doc => ({
            id: doc.id,
            ...doc.data(),
            assignedOn: doc.data().assignedOn?.toDate().toLocaleDateString()
          })));
        }
      }, [selectedDate, state.tasks, filterTasksByDate, setSelectedDateTasks]);
    
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
        <BaseViewHeader
          isSidebarOpen={state.isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="dashboard-page-content">
          <h1 className="dashboard-page-content-welcome-back">
            Welcome back, {state.username}
          </h1>

          <div className="dashboard-page-content-cards">
            {isSearchActive ? (
              <SearchResults
                tasks={filteredTasks}
                onTaskUpdate={refreshDashboard}
              />
            ) : isSelectedDateTasksActive ? (
              <SelectedDateTasks
                tasks={selectedDateTasks}
                selectedDate={selectedDate}
                onTaskUpdate={refreshDashboard}
              />
            ) : (
              <>
                {children}
              </>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
