import IconButton from "../../buttons/IconButton/IconButton";
import "./TaskDetailCard.css";
import { trashIcon, editIcon } from "../../../assets";
import { useTask } from "../../../hooks/useTask";
import { useState } from "react";
import AddTask from "../../../pages/AddTask/AddTask";

const TaskDetailCardHeader = ({ taskData }) => {
    const assignedOn = taskData.assignedOn?.toDate
    ? taskData.assignedOn.toDate().toLocaleDateString()
    : taskData.assignedOn;

    return (
        <div className="task-detail-card-header">
            <div className="task-detail-card-header-left">
                <img src={taskData.image} alt="task" className="task-detail-image"/>
            </div>
            <div className="task-detail-card-header-right">
                <h3 className="task-detail-card-title">{taskData.title}</h3>


                <p className={`task-detail-card-status ${taskData.priority.toLowerCase()}`}>Priority: <span>{taskData.priority}</span></p>
                <p className={`task-detail-card-status ${taskData.status.toLowerCase()}`}>Status: <span>{taskData.status}</span></p>
                <p className="task-detail-card-assigned-on">
                    Assigned On: {assignedOn}



                </p>
            </div>

        </div>
    )
}

const TaskDetailCardBody = ({ taskData }) => {
  return (
      <div className="task-detail-card-body">
          <p className="task-detail-card-body-text">
              {taskData.body.replace(/\\n/g, '\n')}
          </p>
      </div>
  )
}

const TaskDetailCardFooter = ({ onTaskUpdate, onTaskDelete }) => {
    return (
        <div className="task-detail-card-footer">
            <IconButton icon={trashIcon} onClick={onTaskDelete} />
            <IconButton icon={editIcon} onClick={onTaskUpdate} />
        </div>
    )
}

export default function TaskDetailCard({ task, onTaskUpdate }) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { deleteTask } = useTask();

    const getTaskData = () => {
        if(!task) {
            return null;
        }
        // If task is a Firestore document (has data() method)
        if (typeof task.data === 'function') {
          return task.data();

        }
        // If task is already plain data
        return task;
      };
    
    const taskData = getTaskData();

    const assignedOn = taskData ? (taskData.assignedOn instanceof Date 
    ? taskData.assignedOn.toLocaleDateString()
    : typeof taskData.assignedOn === 'string' 
      ? taskData.assignedOn 
      : taskData.assignedOn?.toDate?.()?.toLocaleDateString() || '') : '';


    const handleDelete = async () => {
        if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
          try {
            await deleteTask(task.taskId);
            onTaskUpdate();
          } catch (error) {
            console.error("Görev silinirken hata:", error);
          }
        }
      };

    return (
        task ? (<><div className="task-detail-card">
            <TaskDetailCardHeader taskData={taskData} />
            <TaskDetailCardBody taskData ={taskData} />
            <TaskDetailCardFooter onTaskUpdate={() => setIsEditDialogOpen(!isEditDialogOpen)} onTaskDelete={handleDelete} />
            {isEditDialogOpen && (



        <div
          className="dialog-overlay"
          onClick={() => setIsEditDialogOpen(false)}
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <AddTask
              onClose={() => setIsEditDialogOpen(false)}
              initialData={{
                title: taskData.title,
                date: `${assignedOn.split(".")[2]}-${assignedOn.split(".")[1]}-${
                  assignedOn.split(".")[0]
                }`,


                description: taskData.body,
                status: taskData.status,
                priority: taskData.priority,
                image: taskData.image,


                id: task.id,


              }}
              onTaskUpdate={onTaskUpdate}
            />
          </div>
        </div>
      )}
        </div></>):(<div className="task-detail-card">
            <h3>No task selected</h3>
        </div>)
    )


}