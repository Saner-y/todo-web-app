import SideNavbarItem from "../../card/SideNavbarItem/SideNavbarItem.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "./SideNavbar.css";
import { auth, firestore } from "../../../api/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { sidenavIcons } from "../../../assets/index.js";

export default function SideNavbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsLoading(false);
          return;
        }

        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserDetails(userDocSnap.data());
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
        toast.error("Kullanıcı bilgileri yüklenirken hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
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
          ? sidenavIcons.dashboardActive
          : sidenavIcons.dashboard,
      title: "Dashboard",
      isActive: location.pathname === "/dashboard",
    },
    {
      id: "vital-task",
      icon:
        location.pathname === "/vital-task"
          ? sidenavIcons.vitalActive
          : sidenavIcons.vital,
      title: "Vital Task",
      isActive: location.pathname === "/vital-task",
    },
    {
      id: "my-task",
      icon:
        location.pathname === "/my-task"
          ? sidenavIcons.myTaskActive
          : sidenavIcons.myTask,
      title: "My Task",
      isActive: location.pathname === "/my-task",
    },
    {
      id: "task-categories",
      icon:
        location.pathname === "/task-categories"
          ? sidenavIcons.taskCategoriesActive
          : sidenavIcons.taskCategories,
      title: "Task Categories",
      isActive: location.pathname === "/task-categories",
    },
    {
      id: "settings",
      icon:
        location.pathname === "/settings"
          ? sidenavIcons.settingsActive
          : sidenavIcons.settings,
      title: "Settings",
      isActive: location.pathname === "/settings",
    },
    {
      id: "help",
      icon:
        location.pathname === "/help"
          ? sidenavIcons.helpActive
          : sidenavIcons.help,
      title: "Help",
      isActive: location.pathname === "/help",
    },
  ];

  return (
    <div className="sidenav-wrapper">
      <div className="sidenav-user-details">
        {isLoading ? (
          <>
            <circle className="loading-circle" />
            <p className="sidenav-username">Loading...</p>
          </>
        ) : (
          <>
            <img
              src={userDetails?.profilePicture ?? sidenavIcons.profile}
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
                  if(isActive) {
                    window.location.reload();
                  } else {
                    navigate(`/${id}`);
                  }
                }}
              />

            ))}
          </div>
          <div className="sidenav-logout">
            <SideNavbarItem
              icon={sidenavIcons.logout}
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
