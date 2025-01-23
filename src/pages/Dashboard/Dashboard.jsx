import MainNavbar from "../../components/nav/MainNavbar/MainNavbar.jsx";
import SideNavbar from "../../components/nav/SideNavbar/SideNavbar.jsx";
import MainCard from "../../components/card/MainCard/MainCard.jsx";
import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import './Dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard-page">
            <MainNavbar headerLogo="src/assets/dashboard-header-react.svg"/>
            <div className="dashboard-page-body">
                <SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg" username="asdasd"/>
                <div className="dashboard-page-content">
                    <h1>Welcome back, asdasd</h1>
                    <div className="dashboard-page-content-cards">
                        <div className="dashboard-page-content-todo-section">
                            <div className="dashboard-page-todo-section-header">
                                <h3>To-do</h3>
                                <label className="dashboard-header-add-new-task">
                                    <img src="src/assets/add-react.svg" alt="add"/>
                                    <button className="add-new-tasks-button">Add New Task</button>
                                </label>
                            </div>
                            <div className="dashboard-page-todo-section-date">
                                <p>20 June</p>
                                <p>.</p>
                                <p>Today</p>
                            </div>
                            <div className="dashboard-page-todo-cards">
                                <MainCard status="Not Started" priority="Moderate"
                                          cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                                          cardTitle="Attend Nischal’s Birthday Party" createdAt="20/06/2023"
                                          image="src/assets/maincard-test-react.jpg"/>
                                <MainCard status="Not Started" priority="Moderate"
                                          cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                                          cardTitle="Attend Nischal’s Birthday Party" createdAt="20/06/2023"
                                          image="src/assets/maincard-test-react.jpg"/>
                                <MainCard status="Not Started" priority="Moderate"
                                          cardBody="Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)....."
                                          cardTitle="Attend Nischal’s Birthday Party" createdAt="20/06/2023"
                                          image="src/assets/maincard-test-react.jpg"/>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-page-status-completed-wrapper">
                        <div className="dashboard-page-status-card">
                            <div className="dashboard-page-status-card-header">
                                <img src="src/assets/add-react.svg" alt="add"/>
                                <h3>Task Status</h3>
                            </div>
                            <div className="dashboard-page-status-card-body">
                                <div className="dashboard-page-status-card-body-item">
                                    <div className="dashboard-page-completed-circle">
                                        <CircularProgressbarWithChildren
                                            value={20} styles={buildStyles({
                                            pathColor: "#FFB946",
                                            textColor: "#FFB946",
                                            trailColor: "#E0E0E0"
                                        })}>20</CircularProgressbarWithChildren>
                                        <h4>Completed</h4>
                                    </div>
                                </div>
                                <div className="dashboard-page-status-card-body-item"><div className="dashboard-page-completed-circle">
                                    <CircularProgressbarWithChildren
                                        value={20} styles={buildStyles({
                                        pathColor: "#FFB946",
                                        textColor: "#FFB946",
                                        trailColor: "#E0E0E0"
                                    })}>20</CircularProgressbarWithChildren>
                                    <h4>In Progress</h4>
                                </div></div>
                                <div className="dashboard-page-status-card-body-item"><div className="dashboard-page-completed-circle">
                                    <CircularProgressbarWithChildren
                                        value={20} styles={buildStyles({
                                        pathColor: "#FFB946",
                                        textColor: "#FFB946",
                                        trailColor: "#E0E0E0"
                                    })}>20</CircularProgressbarWithChildren>
                                    <h4>Not Started</h4>
                                </div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}