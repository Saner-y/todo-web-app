import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';
import SideNavbar from "./components/nav/SideNavbar/SideNavbar.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg" username="asdasd"/>} />
                <Route path="/vital-task" element={<SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg" username="asdasd"/>} />
                <Route path="/my-task" element={<SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg" username="asdasd"/>} />
                <Route path="/task-categories" element={<SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg" username="asdasd"/>} />
                <Route path="/settings" element={<SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg" username="asdasd"/>} />
                <Route path="/help" element={<SideNavbar email="asd@asd.com" profilePicture="src/assets/pp.jpg" username="asdasd"/>} />
                {/* Add other routes here */}
            </Routes>
        </Router>
    );
}

export default App;