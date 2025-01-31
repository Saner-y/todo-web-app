import { STATUS_COLORS } from "../../../utils/taskConstants.js";
import CircularProgress from "../../bar/CircularProgress/CircularProgress.jsx";

export function TaskStatusCard({ statusPercentage }) {
    return (
        <div className="dashboard-page-status-card">
            <div className="dashboard-page-status-card-header">
                <img src="src/assets/task-status-react.svg" alt="status" />
                <h3 className="dashboard-page-card-title">Task Status</h3>
            </div>
            <div className="dashboard-page-status-card-body">
                <StatusItem 
                    percentage={statusPercentage?.completed} 
                    color="#05a301" 
                    title="Completed" 
                />
                <StatusItem 
                    percentage={statusPercentage?.inProgress} 
                    color="#ffb946" 
                    title="In Progress" 
                />
                <StatusItem 
                    percentage={statusPercentage?.notStarted} 
                    color="#f21e1e" 
                    title="Not Started" 
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
