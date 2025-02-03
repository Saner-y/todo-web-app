import { STATUS_COLORS } from "../../../utils/taskConstants.js";
import { TASK_STATUS } from "../../../utils/taskConstants.js";
import { taskStatusIcon } from "../../../assets/index.js";
import CircularProgress from "../../bar/CircularProgress/CircularProgress.jsx";

export function TaskStatusCard({ statusPercentage }) {
    return (
        <div className="dashboard-page-status-card">
            <div className="dashboard-page-status-card-header">
                <img src={taskStatusIcon} alt="status" />
                <h3 className="dashboard-page-card-title">Task Status</h3>
            </div>
            <div className="dashboard-page-status-card-body">
                <StatusItem 
                    percentage={statusPercentage?.completed} 
                    color={STATUS_COLORS.COMPLETED} 
                    title={TASK_STATUS.COMPLETED} 
                />
                <StatusItem 

                    percentage={statusPercentage?.inProgress} 
                    color={STATUS_COLORS.IN_PROGRESS} 
                    title={TASK_STATUS.IN_PROGRESS} 
                />
                <StatusItem 
                    percentage={statusPercentage?.notStarted} 
                    color={STATUS_COLORS.NOT_STARTED} 
                    title={TASK_STATUS.NOT_STARTED} 
                />
            </div>

        </div>
    );
}

function StatusItem({ percentage, color, title }) {
    return (
        <div className="dashboard-page-status-card-body-item">
            <CircularProgress percentage={percentage ?? 0} color={color} />
            <h4 className={`${title.toLowerCase().replace(' ', '-')}-task-status-title task-status-title`}>
                {title}
            </h4>
        </div>
    );
}
