import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';
import SideNavbar from "./components/nav/SideNavbar/SideNavbar.jsx";
import MainNavbar from "./components/nav/MainNavbar/MainNavbar.jsx";
import MainCard from "./components/card/MainCard/MainCard.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import { SearchProvider } from './context/SearchContext';
import AddTask from './pages/AddTask/AddTask.jsx';
import { TaskProvider } from './context/TaskContext.jsx';
import BaseView from './layouts/BaseView/BaseView.jsx';
import VitalTask from './pages/VitalTask/VitalTask.jsx';

function App() {
    return (
        <TaskProvider>
        <SearchProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/register"/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/vital-task" element={<VitalTask/>}/>
                    <Route path="/my-task" element={<AddTask/>}/>
                    <Route path="/task-categories"
                           element={<SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg"
                                                username="asdasd"/>}/>
                    <Route path="/settings" element={<MainCard status="Not Started"
                                                               cardBody="Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)"
                                                               createdAt="20/10/2024" priority="Moderate"
                                                               image='src/assets/maincard-test-react.jpg'
                                                               cardTitle="Attend Nischal's Birthday Party" />}/>
                    <Route path="/help"
                           element={<BaseView children={<h1>Help</h1>}/>}/>
                    {/* Add other routes here */}
                </Routes>
            </Router>

        </SearchProvider>
        </TaskProvider>
    );
}

export default App;