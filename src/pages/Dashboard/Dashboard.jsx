import MainNavbar from "../../components/nav/MainNavbar/MainNavbar.jsx";
import SideNavbar from "../../components/nav/SideNavbar/SideNavbar.jsx";
import MainCard from "../../components/card/MainCard/MainCard.jsx";
import { useState, useEffect } from "react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "./Dashboard.css";
import { toast } from "react-toastify";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { firestore } from "../../api/firebase.js";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    async function getUserDetails() {
      const userDocRef = doc(firestore, "users", "5si4dB8xh6fvk7HmO0KY3OQ5v4z1");
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
          "5si4dB8xh6fvk7HmO0KY3OQ5v4z1",
          "tasks"
        );
        const q = query(tasksCollectionRef, where("status", "==", "Completed"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("Tamamlanmış görev bulunamadı");
        } else {
          console.log("Tamamlanmış görevler:", querySnapshot.size); // Debug için
        }

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
          "5si4dB8xh6fvk7HmO0KY3OQ5v4z1",
          "tasks"
        );
        const today = new Date().toISOString().split("T")[0];
        const q = query(tasksCollectionRef, where("date", "==", today));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("Bugün için görev bulunamadı");
        } else {
          console.log("Bugünün görevleri:", querySnapshot.size); // Debug için
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Veri kontrolü ekleyin
  const docs = todaysTasks?.docs || []; // null kontrolü için optional chaining
  if (!todaysTasks || !todaysTasks.docs) {
    return <div className="loading-container">Yükleniyor...</div>;
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
                <div className="dashboard-page-content-todo-section">
                  <div className="dashboard-page-todo-section-header">
                    <h3 className="dashboard-page-card-title">To-do</h3>
                    <label className="dashboard-header-add-new-task">
                      <img src="src/assets/add-react.svg" alt="add" />
                      <button className="add-new-tasks-button">
                        Add New Task
                      </button>
                    </label>
                  </div>
                  <div className="dashboard-page-todo-section-date">
                    <p>20 June</p>
                    <circle className="dashboard-page-date-divider-circle" />
                    <p>Today</p>
                  </div>
                  <div className="dashboard-page-todo-cards">
                    {todaysTasks?.docs?.map((doc) => (
                      <MainCard
                        key={doc.id}
                        status={doc.data().status}
                        priority={doc.data().priority}
                        cardBody={doc.data().body} // "description" yerine "body" kullanıyoruz
                        cardTitle={doc.data().title}
                        createdAt={doc.data().createdOn} // "createdAt" yerine "createdOn" kullanıyoruz
                        image={doc.data().image}
                      />
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
                </div>
                <div className="dashboard-page-status-completed-task-wrapper">
                  <div className="dashboard-page-status-card">
                    <div className="dashboard-page-status-card-header">
                      <img src="src/assets/add-react.svg" alt="add" />
                      <h3 className="dashboard-page-card-title">Task Status</h3>
                    </div>
                    <div className="dashboard-page-status-card-body">
                      <div className="dashboard-page-status-card-body-item">
                        <div className="dashboard-page-completed-circle">
                          <CircularProgressbarWithChildren
                            value={20}
                            styles={buildStyles({
                              pathColor: "#FFB946",
                              textColor: "#FFB946",
                              trailColor: "#E0E0E0",
                            })}
                          >
                            20
                          </CircularProgressbarWithChildren>
                        </div>
                        <h4 className="completed-task-status-title task-status-title">
                          Completed
                        </h4>
                      </div>
                      <div className="dashboard-page-status-card-body-item">
                        <div className="dashboard-page-in-progress-circle">
                          <CircularProgressbarWithChildren
                            value={20}
                            styles={buildStyles({
                              pathColor: "#FFB946",
                              textColor: "#FFB946",
                              trailColor: "#E0E0E0",
                            })}
                          >
                            20
                          </CircularProgressbarWithChildren>
                        </div>
                        <h4 className="in-progress-task-status-title task-status-title">
                          In Progress
                        </h4>
                      </div>
                      <div className="dashboard-page-status-card-body-item">
                        <div className="dashboard-page-not-started-circle">
                          <CircularProgressbarWithChildren
                            value={20}
                            styles={buildStyles({
                              pathColor: "#FFB946",
                              textColor: "#FFB946",
                              trailColor: "#E0E0E0",
                            })}
                          >
                            20
                          </CircularProgressbarWithChildren>
                        </div>
                        <h4 className="not-started-task-status-title task-status-title">
                          Not Started
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-page-completed-task-card">
                    <div className="dashboard-page-completed-task-card-header">
                      <img src="src/assets/add-react.svg" alt="add" />
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
                          createdAt={doc.data().createdOn}
                          image={doc.data().image}
                        />
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
