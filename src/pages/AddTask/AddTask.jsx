import MainButton from "../../components/buttons/MainButton/MainButton.jsx";

export default function AddTask () {
    return (
        <div className="add-task-dialog">
            <div className="add-task-dialog-header">
                <h3 className="add-task-dialog-header-title">Add Task</h3>
                <h4 className="add-task-dialog-header-go-back">Go back</h4>
            </div>
            <div className="add-task-dialog-body">
                    <p>Title</p>
                
                    <input type="text" placeholder="Title" />
                
                    <p>Date</p>
                    <input type="date" placeholder="Date" />
                    <p>Priority</p>
                    <div className="add-task-dialog-priority-container">
                        <div className="add-task-dialog-priority-container-low">
                            <p>Low</p>
                            <input type="checkbox" name="priority" value="low" />
                        </div>
                        <div className="add-task-dialog-priority-container-medium">
                            <p>Moderate</p>
                            <input type="checkbox" name="priority" value="moderate" />
                        </div>
                        <div className="add-task-dialog-priority-container-high">
                            <p>Extreme</p>
                            <input type="checkbox" name="priority" value="extreme" />
                        </div>
                    </div>
                <div className="add-task-dialog-description-image-container">
                    <div className="add-task-dialog-description-container">
                    <p>Task Description</p>
                    <textarea placeholder="Task Description" /></div>
                    <div className="add-task-dialog-image-container">
                        <p>Upload Image</p>
                        <input type="file" accept="image/*" className="add-task-dialog-image-input" />
                    </div>
                </div>
            </div>
            <div className="add-task-dialog-footer">
                <MainButton text="Done" />
            </div>
        </div>
    )
}