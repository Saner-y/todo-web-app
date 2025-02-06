import SearchBar from "../../inputs/SearchBar/SearchBar.jsx";
import IconButton from "../../buttons/IconButton/IconButton.jsx";
import "./MainNavbar.css";
import { calendarIcon, notificationIcon } from "../../../assets/index.js";
import { useSearch } from "../../../context/SearchContext.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { firestore } from "../../../api/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { menuIcon } from "../../../assets/index.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useTasks } from "../../../context/TaskContext.jsx";
import { useNavigate } from "react-router-dom";

export default function MainNavbar({ headerLogo, toggleSidebar }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { setSearchTerm, setIsSearchActive } = useSearch();
  const dateObject = new Date();
  const day = dateObject.toLocaleDateString("en-US", { weekday: "long" });
  const date = dateObject.toLocaleDateString().replaceAll(".", "/");
  const { currentUser } = useAuth();
  const { setSelectedDateTasks, setSelectedDate, setIsSelectedDateTasksActive } = useTasks();
  const navigate = useNavigate();

  const getNotification = async () => {
    const today = new Date().toISOString().split("T")[0];
    const tasks = await getDocs(
      collection(firestore, `users/${currentUser.uid}/tasks`)
    );
    const dailyTasks = tasks.docs.filter(
      (task) => task.data().assignedOn === today
    );
    console.log(dailyTasks);
  };

  const handleDateSelect = async (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const tasks = await getDocs(
      collection(firestore, `users/${currentUser.uid}/tasks`)
    );
    const selectedDateTasks = tasks.docs.filter(
      (task) => task.data().assignedOn === formattedDate
    );
    setSelectedDateTasks(
      selectedDateTasks.map((task) => ({ id: task.id, ...task.data() }))
    ); 
    setSelectedDate(selectedDate);
    setShowDatePicker(false);
    setIsSelectedDateTasksActive(true);
  };



  return (
    <nav className="main-navbar">
      {/* Mobil için menü butonu */}
      <button className="menu-toggle-button" onClick={toggleSidebar}>
        {/* Menü ikonu */}
        <img src={menuIcon} alt="menu" />
      </button>
      <div className="main-navbar-logo">
        <img src={headerLogo} alt="logo" onClick={() => {
          if(location.pathname === "/dashboard") {
            window.location.reload();
          } else {
            navigate("/dashboard");
          }
        }} />
      </div>
      <SearchBar

        placeholder="Search your tasks..."
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsSearchActive(e.target.value.length > 0);
        }}
      />
      <div className="icon-button-div">
        <IconButton icon={notificationIcon} alt="notification" />
        <div className="calendar-picker-container">
          <IconButton
            icon={calendarIcon}
            alt="calendar"
            onClick={() => {
              setShowDatePicker(!showDatePicker);
            }}
          />

          {showDatePicker && (
            <div className="date-picker-popup">
              <DatePicker
                inline
                onChange={handleDateSelect}
                onClickOutside={() => {
                  setShowDatePicker(false);
                }}


              />
            </div>

          )}
        </div>
      </div>
      <div className="datetime-div">
        <p className="datetime-day-string">{day}</p>
        <p className="datetime-day">{date}</p>
      </div>
    </nav>
  );
}
