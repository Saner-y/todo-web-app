import MainNavbar from "../../components/nav/MainNavbar/MainNavbar.jsx";
import SideNavbar from "../../components/nav/SideNavbar/SideNavbar.jsx";
import MainCard from "../../components/card/MainCard/MainCard.jsx";
import { useState, useEffect, useMemo } from "react";
import "./Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import { useSearch } from "../../context/SearchContext.jsx";

import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../../api/firebase.js";
import CircularProgress from "../../components/bar/CircularProgress/CircularProgress.jsx";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [statusPercantage, setStatusPercantage] = useState({
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });
  const today = new Date();
  const { searchTerm, isSearchActive } = useSearch();
  const [tasks, setTasks] = useState([]);

  const filteredTasks = useMemo(() => {
    if (!isSearchActive) return tasks;

    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm, isSearchActive]);

  useEffect(() => {
    setIsLoading(true);
    async function getUserDetails() {
      const userDocRef = doc(firestore, "users", localStorage.getItem("uid"));
      const userDocSnap = await getDoc(userDocRef);
      setUserDetails(userDocSnap.data().username);
      setIsLoading(false);
    }
    getUserDetails();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    async function getCompletedTasks() {
      try {
        const tasksCollectionRef = collection(
          firestore,
          "users",
          localStorage.getItem("uid"),
          "tasks"
        );
        const q = query(tasksCollectionRef, where("status", "==", "Completed"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("Tamamlanmış görev bulunamadı");
        } else {
          console.log("Tamamlanmış görevler:", querySnapshot.size); // Debug için
        }

        console.log(querySnapshot.docs);

        setCompletedTasks(querySnapshot);
        setIsLoading(false);
      } catch (error) {
        console.error("Completed tasks error:", error);
        toast.error("Tamamlanan görevler yüklenirken hata oluştu");
        setIsLoading(false);
      }
    }

    getCompletedTasks();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    async function getTodaysTasks() {
      try {
        const tasksCollectionRef = collection(
          firestore,
          "users",
          localStorage.getItem("uid"),
          "tasks"
        );

        // Bugünün başlangıç ve bitiş zamanlarını oluştur
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Timestamp'leri Firestore formatına çevir
        const startOfDay = Timestamp.fromDate(today);
        const endOfDay = Timestamp.fromDate(tomorrow);

        const q = query(
          tasksCollectionRef,
          where("createdOn", ">=", startOfDay),
          where("createdOn", "<", endOfDay)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("Bugün için görev bulunamadı");
        } else {
          console.log("Bugünün görevleri:", querySnapshot.size);
        }

        setTodaysTasks(querySnapshot);
        setIsLoading(false);
      } catch (error) {
        console.error("Today's tasks error:", error);
        toast.error("Günlük görevler yüklenirken hata oluştu");
        setIsLoading(false);
      }
    }

    getTodaysTasks();
  }, []);

  useEffect(() => {
    async function calculatePerStatus() {
      try {
        const tasksCollectionRef = collection(
          firestore,
          "users",
          localStorage.getItem("uid"),
          "tasks"
        );

        // Önce tüm görevleri çekelim
        const allTasksSnapshot = await getDocs(tasksCollectionRef);
        const totalTasks = allTasksSnapshot.size;

        if (totalTasks === 0) {
          setStatusPercantage({
            completed: 0,
            inProgress: 0,
            notStarted: 0,
          });
          return;
        }

        // Her bir status için ayrı query
        const completedSnapshot = await getDocs(
          query(tasksCollectionRef, where("status", "==", "Completed"))
        );
        const inProgressSnapshot = await getDocs(
          query(tasksCollectionRef, where("status", "==", "In Progress"))
        );
        const notStartedSnapshot = await getDocs(
          query(tasksCollectionRef, where("status", "==", "Not Started"))
        );

        // Yüzdeleri hesapla
        const completedPercantage = Math.round(
          (completedSnapshot.size / totalTasks) * 100
        );
        const inProgressPercantage = Math.round(
          (inProgressSnapshot.size / totalTasks) * 100
        );
        const notStartedPercantage = Math.round(
          (notStartedSnapshot.size / totalTasks) * 100
        );

        console.log("Status percentages:", {
          // Debug için
          completed: completedPercantage,
          inProgress: inProgressPercantage,
          notStarted: notStartedPercantage,
        });

        setStatusPercantage({
          completed: completedPercantage,
          inProgress: inProgressPercantage,
          notStarted: notStartedPercantage,
        });
      } catch (error) {
        console.error("Calculate status percentage error:", error);
        toast.error("Görev durumu yüzdeleri hesaplanırken hata oluştu");
        // Hata durumunda varsayılan değerler
        setStatusPercantage({
          completed: 0,
          inProgress: 0,
          notStarted: 0,
        });
      }
    }

    calculatePerStatus();
  }, []); // Bağımlılıkları ekleyebilirsiniz

  useEffect(() => {
    async function getAllTasks() {
      try {
        const tasksCollectionRef = collection(
          firestore,
          "users",
          localStorage.getItem("uid"),
          "tasks"
        );
        const querySnapshot = await getDocs(tasksCollectionRef);
        const tasksList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Timestamp'leri tarihe dönüştür
          return {
            id: doc.id,
            ...data,
            createdOn: data.createdOn?.toDate().toLocaleDateString() || ''
          };
        });
        setTasks(tasksList);
      } catch (error) {
        console.error("Görevler yüklenirken hata oluştu:", error);
        toast.error("Görevler yüklenirken hata oluştu");
      }
    }
    getAllTasks();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Veri kontrolü ekleyin
  if (
    !todaysTasks ||
    !todaysTasks.docs ||
    !completedTasks ||
    !completedTasks.docs
  ) {
    return (
      <div className="loading-container">
        <circle className="loading-circle" />
      </div>
    );
  }

  

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-body">
        <MainNavbar
          headerLogo="src/assets/dashboard-header-react.svg"
          toggleSidebar={toggleSidebar}
        />
        <div
          className={`sidebar-backdrop ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`dashboard-page-sidebar ${isSidebarOpen ? "open" : ""}`}
        >
          <div className="dashboard-sidebar-wrapper">
            <SideNavbar />
          </div>
        </div>
        {isLoading ? (
          <div className="loading-container">
            <circle className="loading-circle" />
          </div>
        ) : (
          <>
            <div className="dashboard-page-content">
              <h1 className="dashboard-page-content-welcome-back">
                Welcome back, {userDetails}
              </h1>
              <div className="dashboard-page-content-cards">
                
            {isSearchActive ? (<div>
        {filteredTasks.map((task) => (
          <MainCard key={task.id} cardTitle={task.title} cardBody={task.body} priority={task.priority} status={task.status} createdAt={task.createdOn} image={task.image}/>
        ))}
      </div>):(<><div className="dashboard-page-content-todo-section">
                      <div className="dashboard-page-todo-section-header">
                        <div className="dashboard-page-status-card-header">
                          <img src="src/assets/tasks-react.svg" alt="tasks" />
                          <h3 className="dashboard-page-card-title">To-Do</h3>
                        </div>
                        <label className="dashboard-header-add-new-task">
                          <img src="src/assets/add-react.svg" alt="add" />
                          <button className="add-new-tasks-button">
                            Add New Task
                          </button>
                        </label>
                      </div>
                      <div className="dashboard-page-todo-section-date">
                        <p>{today.toLocaleDateString()}</p>
                        <circle className="dashboard-page-date-divider-circle" />
                        <p>Today</p>
                      </div>
                      <div className="dashboard-page-todo-cards">
                        {todaysTasks?.docs?.map((doc) => (
                          <MainCard
                            key={doc.id}
                            status={doc.data().status}
                            priority={doc.data().priority}
                            cardBody={doc.data().body}
                            cardTitle={doc.data().title}
                            createdAt={doc
                              .data()
                              .createdOn?.toDate()
                              .toLocaleDateString()}
                            image={doc.data().image} />
                        ))}
                        {/* <MainCard
  status="Not Started"
  priority="Moderate"
  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
  cardTitle="Attend Nischal's Birthday Party"
  createdAt="20/06/2023"
  image="src/assets/maincard-test-react.jpg"
/>
<MainCard
  status="Not Started"
  priority="Moderate"
  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
  cardTitle="Attend Nischal's Birthday Party"
  createdAt="20/06/2023"
  image="src/assets/maincard-test-react.jpg"
/>
<MainCard
  status="Not Started"
  priority="Moderate"
  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
  cardTitle="Attend Nischal's Birthday Party"
  createdAt="20/06/2023"
  image="src/assets/maincard-test-react.jpg"
/> */}
                      </div>
                    </div><div className="dashboard-page-status-completed-task-wrapper">
                        <div className="dashboard-page-status-card">
                          <div className="dashboard-page-status-card-header">
                            <img
                              src="src/assets/task-status-react.svg"
                              alt="status" />
                            <h3 className="dashboard-page-card-title">Task Status</h3>
                          </div>
                          <div className="dashboard-page-status-card-body">
                            <div className="dashboard-page-status-card-body-item">
                              <CircularProgress
                                percentage={statusPercantage?.completed ?? 0}
                                color="#05a301" />
                              <h4 className="completed-task-status-title task-status-title">
                                Completed
                              </h4>
                            </div>
                            <div className="dashboard-page-status-card-body-item">
                              <CircularProgress
                                percentage={statusPercantage?.inProgress ?? 0}
                                color="#ffb946" />
                              <h4 className="in-progress-task-status-title task-status-title">
                                In Progress
                              </h4>
                            </div>
                            <div className="dashboard-page-status-card-body-item">
                              <CircularProgress
                                percentage={statusPercantage?.notStarted ?? 0}
                                color="#f21e1e" />
                              <h4 className="not-started-task-status-title task-status-title">
                                Not Started
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="dashboard-page-completed-task-card">
                          <div className="dashboard-page-completed-task-card-header">
                            <img
                              src="src/assets/completed-tasks-react.svg"
                              alt="completed" />
                            <h3 className="dashboard-page-card-title">
                              Completed Task
                            </h3>
                          </div>
                          <div className="dashboard-page-completed-task-card-body">
                            {completedTasks?.docs?.map((doc) => (
                              <MainCard
                                key={doc.id}
                                status={doc.data().status}
                                priority={doc.data().priority}
                                cardBody={doc.data().body}
                                cardTitle={doc.data().title}
                                createdAt={doc
                                  .data()
                                  .createdOn?.toDate()
                                  .toLocaleDateString()}
                                image={doc.data().image} />
                            ))}
                            {/* <MainCard
  status="Not Started"
  priority="Moderate"
  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
  cardTitle="Attend Nischal's Birthday Party"
  createdAt="20/06/2023"
  image="src/assets/maincard-test-react.jpg"
/>
<MainCard
  status="Not Started"
  priority="Moderate"
  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
  cardTitle="Attend Nischal's Birthday Party"
  createdAt="20/06/2023"
  image="src/assets/maincard-test-react.jpg"
/> */}
                          </div>
                        </div>
                      </div></>)}
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer
        style={{
          width: "300px",
          height: "100px",
          backgroundColor: "red",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      />
    </div>
  );
}
