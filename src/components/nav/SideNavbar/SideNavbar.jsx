import SideNavbarItem from "../../card/SideNavbarItem/SideNavbarItem.jsx";
import {useAuth} from "../../../hooks/useAuth.js";
import {toast, ToastContainer} from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";
import './SideNavbar.css';

export default function SideNavbar({username, email, profilePicture}) {
    const {logout} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const items = [
        {
            id: 'dashboard',
            icon: location.pathname === '/dashboard' ? 'src/assets/dashboard-active-react.svg' : 'src/assets/dashboard-react.svg',
            title: 'Dashboard',
            isActive: location.pathname === '/dashboard'
        },
        {
            id: 'vital-task',
            icon: location.pathname === '/vital-task' ? 'src/assets/exclamation-active-react.svg' : 'src/assets/exclamation-react.svg',
            title: 'Vital Task',
            isActive: location.pathname === '/vital-task'
        },
        {
            id: 'my-task',
            icon: location.pathname === '/my-task' ? 'src/assets/checklist-active-react.svg' : 'src/assets/checklist-react.svg',
            title: 'My Task',
            isActive: location.pathname === '/my-task'
        },
        {
            id: 'task-categories',
            icon: location.pathname === '/task-categories' ? 'src/assets/list-active-react.svg' : 'src/assets/list-react.svg',
            title: 'Task Categories',
            isActive: location.pathname === '/task-categories'
        },
        {
            id: 'settings',
            icon: location.pathname === '/settings' ? 'src/assets/settings-active-react.svg' : 'src/assets/settings-react.svg',
            title: 'Settings',
            isActive: location.pathname === '/settings'
        },
        {
            id: 'help',
            icon: location.pathname === '/help' ? 'src/assets/help-active-react.svg' : 'src/assets/help-react.svg',
            title: 'Help',
            isActive: location.pathname === '/help'
        },
    ];

    async function logoutFn() {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await logout();
                navigate('/login');
            } catch (error) {
                toast.error(error.message);
            }
        }
    }

    return (
        <div className="sidenav-wrapper">
            <div className="sidenav-user-details">
                <img src={profilePicture} alt={profilePicture.name} className="sidenav-profile-picture"/>
                <p className="sidenav-username">{username}</p>
                <p className="sidenav-email">{email}</p>
            </div>
            <div className="sidenavbar">
                <div className="sidenav-items">
                    <div className="sidenav-item-list">
                        {items.map(({id, icon, title, isActive}) => (
                            <SideNavbarItem key={id} icon={icon} title={title} isActive={isActive} onClick={() => {
                                navigate(`/${id}`)
                            }}/>
                        ))}
                    </div>
                    <div className="sidenav-logout">
                        <SideNavbarItem icon="src/assets/logout-react.svg" isActive={false} title="Logout"
                                        onClick={logoutFn}/>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </div>
    )

}