import MainNavbar from "../../components/nav/MainNavbar/MainNavbar.jsx";
import SideNavbar from "../../components/nav/SideNavbar/SideNavbar.jsx";
import MainCard from "../../components/card/MainCard/MainCard.jsx";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <MainNavbar headerLogo="src/assets/dashboard-header-react.svg" />
      <div className="dashboard-page-body">
        <div className="dashboard-page-sidebar">
          <SideNavbar
            email="asd@asd.com"
            profilePicture="src/assets/pp.jpg"
            username="asdasd"
          />
        </div>
        <div className="dashboard-page-content">
          <h1 className="dashboard-page-content-welcome-back">
            Welcome back, asdasd
          </h1>
          <div className="dashboard-page-content-cards">
            <div className="dashboard-page-content-todo-section">
              <div className="dashboard-page-todo-section-header">
                <h3>To-do</h3>
                <label className="dashboard-header-add-new-task">
                  <img src="src/assets/add-react.svg" alt="add" />
                  <button className="add-new-tasks-button">Add New Task</button>
                </label>
              </div>
              <div className="dashboard-page-todo-section-date">
                <p>20 June</p>
                <circle className="dashboard-page-date-divider-circle" />
                <p>Today</p>
              </div>
              <div className="dashboard-page-todo-cards">
                <MainCard
                  status="Not Started"
                  priority="Moderate"
                  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                  cardTitle="Attend Nischal’s Birthday Party"
                  createdAt="20/06/2023"
                  image="src/assets/maincard-test-react.jpg"
                />
                <MainCard
                  status="Not Started"
                  priority="Moderate"
                  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                  cardTitle="Attend Nischal’s Birthday Party"
                  createdAt="20/06/2023"
                  image="src/assets/maincard-test-react.jpg"
                />
                <MainCard
                  status="Not Started"
                  priority="Moderate"
                  cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                  cardTitle="Attend Nischal’s Birthday Party"
                  createdAt="20/06/2023"
                  image="src/assets/maincard-test-react.jpg"
                />
              </div>
            </div>
            <div className="dashboard-page-status-completed-task-wrapper">
              <div className="dashboard-page-status-card">
                <div className="dashboard-page-status-card-header">
                  <img src="src/assets/add-react.svg" alt="add" />
                  <h3>Task Status</h3>
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
                  <h3>Completed Task</h3>
                </div>
                <div className="dashboard-page-completed-task-card-body">
                  <MainCard
                    status="Not Started"
                    priority="Moderate"
                    cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                    cardTitle="Attend Nischal’s Birthday Party"
                    createdAt="20/06/2023"
                    image="src/assets/maincard-test-react.jpg"
                  />
                  <MainCard
                    status="Not Started"
                    priority="Moderate"
                    cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                    cardTitle="Attend Nischal’s Birthday Party"
                    createdAt="20/06/2023"
                    image="src/assets/maincard-test-react.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
