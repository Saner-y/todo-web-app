import SideNavbarItem from "../../card/SideNavbarItem/SideNavbarItem.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "./SideNavbar.css";
import { auth, firestore } from "../../../api/firebase.js";
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function SideNavbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    setIsLoading(true);
    async function getUserDetails() {
      if (!localStorage.getItem('uid')) {
        console.log('Kullanıcı oturumu bulunamadı');
        return;
      }

      try {
        const userDocRef = doc(firestore, 'users', localStorage.getItem('uid'));
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserDetails(userDocSnap.data());
          setIsLoading(false);
        } else {
          console.log('Kullanıcı bulunamadı');
        }
      } catch (error) {
        console.error('Kullanıcı detayları alınırken hata oluştu:', error);
      }
    }
    
    getUserDetails();
  }, []);

  async function logoutFn() {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  const items = [
    {
      id: "dashboard",
      icon:
        location.pathname === "/dashboard"
          ? "src/assets/dashboard-active-react.svg"
          : "src/assets/dashboard-react.svg",
      title: "Dashboard",
      isActive: location.pathname === "/dashboard",
    },
    {
      id: "vital-task",
      icon:
        location.pathname === "/vital-task"
          ? "src/assets/exclamation-active-react.svg"
          : "src/assets/exclamation-react.svg",
      title: "Vital Task",
      isActive: location.pathname === "/vital-task",
    },
    {
      id: "my-task",
      icon:
        location.pathname === "/my-task"
          ? "src/assets/checklist-active-react.svg"
          : "src/assets/checklist-react.svg",
      title: "My Task",
      isActive: location.pathname === "/my-task",
    },
    {
      id: "task-categories",
      icon:
        location.pathname === "/task-categories"
          ? "src/assets/list-active-react.svg"
          : "src/assets/list-react.svg",
      title: "Task Categories",
      isActive: location.pathname === "/task-categories",
    },
    {
      id: "settings",
      icon:
        location.pathname === "/settings"
          ? "src/assets/settings-active-react.svg"
          : "src/assets/settings-react.svg",
      title: "Settings",
      isActive: location.pathname === "/settings",
    },
    {
      id: "help",
      icon:
        location.pathname === "/help"
          ? "src/assets/help-active-react.svg"
          : "src/assets/help-react.svg",
      title: "Help",
      isActive: location.pathname === "/help",
    },
  ];

  return (
    <div className="sidenav-wrapper">
      <div className="sidenav-user-details">
        
        {isLoading ? <><circle className="loading-circle"/><p className="sidenav-username">Loading...</p></> : (
        <>
        <img
          src={userDetails?.profilePicture ?? "src/assets/pp.jpg"}
          alt={userDetails?.profilePicture ?? "profile picture"}
          className="sidenav-profile-picture"
        />
        <p className="sidenav-username">{userDetails?.username}</p>
        <p className="sidenav-email">{userDetails?.email}</p>
        </>
        )}
      </div>
      <div className="sidenavbar">
        <div className="sidenav-items">
          <div className="sidenav-item-list">
            {items.map(({ id, icon, title, isActive }) => (
              <SideNavbarItem
                key={id}
                icon={icon}
                title={title}
                isActive={isActive}
                onClick={() => {
                  navigate(`/${id}`);
                }}
              />
            ))}
          </div>
          <div className="sidenav-logout">
            <SideNavbarItem
              icon="src/assets/logout-react.svg"
              isActive={false}
              title="Logout"
              onClick={logoutFn}
            />
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
