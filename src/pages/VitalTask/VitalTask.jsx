import TaskDetailCard from "../../components/card/TaskDetailCard/TaskDetailCard";
import BaseView from "../../layouts/BaseView/BaseView";
import { useTasks } from "../../context/TaskContext";
import { useTask } from "../../hooks/useTask";
import { useEffect, useState } from "react";
import "./VitalTask.css";
import MainCard from "../../components/card/MainCard/MainCard";


const VitalTasksSection = ({ vitalTasks, onTaskUpdate }) => {
  return (
    <div className="vital-tasks-section">
      <div className="vital-tasks-section-header">
        <h3 className="vital-tasks-section-title">Vital Tasks</h3>
      </div>
      <div className="vital-tasks-section-body">
        {vitalTasks?.docs?.map((task) => (
          <MainCard
          key={task.id}
          task={task}
          onTaskUpdate={onTaskUpdate}
          />

        ))}
      </div>
    </div>
  );
};

export default function VitalTask() {
  const { getVitalTasks } = useTask();
  const { selectedTask, setSelectedTask } = useTasks();
  const [vitalTasks, setVitalTasks] = useState([]);

  useEffect(() => {
    getVitalTasks().then((tasks) => {
      setVitalTasks(tasks);
    });
  }, [getVitalTasks]);

  return (
    <BaseView>
    <div className="vital-task-page">
        <VitalTasksSection vitalTasks={vitalTasks} />
        <TaskDetailCard task={selectedTask} onTaskUpdate={() => {
          setSelectedTask(null);
        }} />
    </div>
    </BaseView>


  );
}


