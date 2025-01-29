import SearchBar from "../../inputs/SearchBar/SearchBar.jsx";
import IconButton from "../../buttons/IconButton/IconButton.jsx";
import { useState } from "react";
import "./MainNavbar.css";
import calendarIcon from "../../../assets/calendar-react.svg";
import notificationIcon from "../../../assets/notification-react.svg";
import { getDocs } from "firebase/firestore";
import { useSearch } from "../../../context/SearchContext.jsx";

export default function MainNavbar({ headerLogo, toggleSidebar }) {
  const { handleSearch } = useSearch();
  const [searchValue, setSearchValue] = useState("");
  const dateObject = new Date();
  const day = dateObject.toLocaleDateString("en-US", { weekday: "long" });
  const date = dateObject.toLocaleDateString().replaceAll(".", "/");
  function searchTasks (value) {
    const tasks = getDocs(query(tasksCollectionRef, where("title", "==", value)));
    tasks += getDocs(query(tasksCollectionRef, where("body", "==", value)));
    tasks += getDocs(query(tasksCollectionRef, where("createdOn", "==", value)));
    tasks += getDocs(query(tasksCollectionRef, where("deadline", "==", value)));
    tasks += getDocs(query(tasksCollectionRef, where("priority", "==", value)));
    tasks += getDocs(query(tasksCollectionRef, where("status", "==", value)));
    
  }

  return (
    <nav className="main-navbar">
      {/* Mobil için menü butonu */}
      <button
        className="menu-toggle-button"
        onClick={toggleSidebar}
      >
        {/* Menü ikonu */}
        <img src="src/assets/add-react.svg" alt="menu" />
      </button>
      <div className="main-navbar-logo">
        <img src={headerLogo} alt="logo" />
      </div>
      <input 
        type="text"
        placeholder="Görev ara..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="icon-button-div">
        <IconButton icon={notificationIcon} alt="notification" />
        <IconButton icon={calendarIcon} alt="calendar" />
      </div>
      <div className="datetime-div">
        <p className="datetime-day-string">{day}</p>
        <p className="datetime-day">{date}</p>
      </div>
    </nav>
  );
}
