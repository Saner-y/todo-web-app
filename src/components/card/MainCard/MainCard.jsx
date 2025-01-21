import editButton from '../../../assets/edit-button-react.svg';
import './MainCard.css';

export default function MainCard({cardTitle, cardBody, status, priority, createdAt, image}) {
    const statusClass = `status-${status.toLowerCase().replace(' ', '-')}`;
    const priorityClass = `priority-${priority.toLowerCase().replace(' ', '-')}`;

    return (
        <div className="main-card">
            <div className={`status-circle ${statusClass}`}/>
            <div className="main-card-header-body-wrapper">
                <div className="main-card-header">
                    <h1 className="main-card-header-title">{cardTitle}</h1>
                    <img src={editButton} alt="edit" className="main-card-header-edit"/>
                </div>
                <div className="main-card-body">
                    <p className="main-card-body-text">{cardBody}</p>
                    <img src={image} alt={image.name} className="main-card-body-image"/>
                </div>
                <div className="main-card-footer">
                    <div className="main-card-footer-status">
                        <p>Priority: <span
                            className={`main-card-footer-priority-text ${priorityClass}`}>{priority}</span>
                        </p>
                        <p>Status: <span className={`main-card-footer-status-text ${statusClass}`}>{status}</span></p>
                    </div>
                    <p className="main-card-footer-date">Created on: {createdAt}</p>
                </div>
            </div>
        </div>
    )
        ;
}