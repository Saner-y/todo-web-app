import { useState } from "react";
import MainButton from "../../components/buttons/MainButton/MainButton.jsx";
import "./AddTask.css";
import { setDoc, doc, Timestamp, collection } from "firebase/firestore";
import { firestore } from "../../api/firebase.js";

export default function AddTask({ onClose }) {
    const [priority, setPriority] = useState("low");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const saveTask = async () => {
        if (!title) {
            console.log("Title is required");
            return; // Prevent empty title
        }
        const tasksRef = collection(firestore, "users", localStorage.getItem("uid"), "tasks");
        const taskDoc = doc(tasksRef);
        console.log(taskDoc);
        await setDoc(taskDoc, {
            title: title,
            createdOn: Timestamp.fromDate(new Date(date)),
            body: description,
            image: image,
            priority: priority,
            status: "Not Started",
        });
        console.log("Task saved successfully");
        onClose();
    }
  return (
    <div className="add-task-dialog">
      <div className="add-task-dialog-header">
        <h3 className="add-task-dialog-header-title">Add Task</h3>
        <h4 
          className="add-task-dialog-header-go-back"
          onClick={onClose}
        >
          Go back
        </h4>
      </div>
      <div className="add-task-dialog-body">
        <p className="add-task-dialog-body-title">Title</p>
        <input type="text" className="add-task-dialog-body-title-input" onChange={(e) => setTitle(e.target.value)}/>
        <p className="add-task-dialog-body-date">Date</p>
        <input type="date" placeholder="Date" className="add-task-dialog-body-date-input" onChange={(e) => setDate(e.target.value)}/>
        <p className="add-task-dialog-body-priority">Priority</p>
        <div className="add-task-dialog-priority-container">
          <div className="add-task-dialog-priority-container-low">
            <p>Low</p>
            <input type="checkbox" name="priority" value="low" checked={priority === "low"} onChange={() => setPriority("Low")} />
          </div>
          <div className="add-task-dialog-priority-container-medium">
            <p>Moderate</p>
            <input type="checkbox" name="priority" value="Moderate" checked={priority === "Moderate"} onChange={() => setPriority("Moderate")} />
          </div>
          <div className="add-task-dialog-priority-container-high">
            <p>Extreme</p>
            <input type="checkbox" name="priority" value="Extreme" checked={priority === "Extreme"} onChange={() => setPriority("Extreme")} />
          </div>
        </div>
        <div className="add-task-dialog-description-image-container-header">
          <p className="add-task-dialog-description-image-container-header-title">
            Task Description
          </p>
          <p className="add-task-dialog-description-image-container-header-upload">
            Upload Image
          </p>
        </div>
        <div className="add-task-dialog-description-image-container">
          <textarea
            placeholder="Task Description"
            className="add-task-dialog-description-textarea"
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="add-task-dialog-image-input">
            <input
              type="file"
              accept="image/*"
              className="add-task-dialog-image-input-file"
            />
            <img src="src/assets/upload-image-react.svg" alt="task" className="add-task-dialog-image-input-image" />
            <p className="add-task-dialog-image-input-text">
              Click to upload image
            </p>
          </div>
        </div>
      </div>
      <div className="add-task-dialog-footer">
        <MainButton text="Done" onClick={saveTask} />
      </div>
    </div>
  );
}
