import "./MainCard.css";
import { useState, useRef, useEffect } from "react";
import { useTask } from "../../../hooks/useTask";
import AddTask from "../../../pages/AddTask/AddTask";

export default function MainCard({
  cardTitle,
  cardBody,
  status,
  priority,
  assignedOn,
  image,
  taskId,
  onTaskUpdate,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { updateTask, deleteTask } = useTask();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const statusClass = `status-${status.toLowerCase().replace(" ", "-")}`;
  const priorityClass = `priority-${priority.toLowerCase().replace(" ", "-")}`;

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setIsMenuOpen(false);
      onTaskUpdate();
    } catch (error) {
      console.error("Status güncellenirken hata:", error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await updateTask(taskId, { priority: newPriority });
      setIsMenuOpen(false);
      onTaskUpdate();
    } catch (error) {
      console.error("Priority güncellenirken hata:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
      try {
        await deleteTask(taskId);
        onTaskUpdate();
      } catch (error) {
        console.error("Görev silinirken hata:", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions = ["Not Started", "In Progress", "Completed"];
  const priorityOptions = ["Low", "Moderate", "Extreme"];

  return (
    <div className="main-card">
      <circle className={`status-circle ${statusClass}`} />
      <div className="main-card-header-body-wrapper">
        <div className="main-card-header">
          <h1 className="main-card-header-title">{cardTitle}</h1>
          <div className="menu-container" ref={menuRef}>
            <button
              className="main-card-header-edit-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="main-card-header-edit-button-circle-wrapper">
                <circle className="main-card-header-edit-button-circle" />
                <circle className="main-card-header-edit-button-circle" />
                <circle className="main-card-header-edit-button-circle" />
              </div>
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <div className="status-section">
                  <p className="menu-title">Change Status</p>
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      className={`status-option ${
                        status === option ? "active" : ""
                      } ${status === option ? statusClass : ""}`}
                      onClick={() => handleStatusChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="menu-divider"></div>
                <div className="priority-section">
                  <p className="menu-title">Change Priority</p>
                  {priorityOptions.map((option) => (
                    <button
                      key={option}
                      className={`priority-option ${
                        priority === option ? "active" : ""
                      } ${priority === option ? priorityClass : ""}`}
                      onClick={() => handlePriorityChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="menu-divider"></div>
                <div className="action-buttons">
                  <button
                    className="menu-button update-button"
                    onClick={() => setIsEditDialogOpen(!isEditDialogOpen)}
                  >
                    Edit
                  </button>
                  <button
                    className="menu-button delete-button"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="main-card-body">
          <p className="main-card-body-text">{cardBody}</p>

          <img src={image} alt={"image"} className="main-card-body-image" />
        </div>
        <div className="main-card-footer">
          <div className="main-card-footer-status">
            <p>
              Priority:{" "}
              <span
                className={`main-card-footer-priority-text ${priorityClass}`}
              >
                {priority}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className={`main-card-footer-status-text ${statusClass}`}>
                {status}
              </span>
            </p>
          </div>
          <p className="main-card-footer-date">Assigned on: {assignedOn}</p>
        </div>
      </div>
      {isEditDialogOpen && (
        <div
          className="dialog-overlay"
          onClick={() => setIsEditDialogOpen(false)}
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <AddTask
              onClose={() => setIsEditDialogOpen(false)}
              initialData={{
                title: cardTitle,
                date: `${assignedOn.split(".")[2]}-${assignedOn.split(".")[1]}-${
                  assignedOn.split(".")[0]
                }`,
                description: cardBody,
                status: status,
                priority: priority,
                image: image,
                id: taskId,
              }}
              onTaskUpdate={onTaskUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
