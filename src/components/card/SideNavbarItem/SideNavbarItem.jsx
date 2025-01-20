import './SideNavbarItem.css'

export default function SideNavbarItem ({isActive, icon, title, onClick}) {
    return (
        <div className={isActive ? "active-item" : "item"} onClick={onClick}>
            <img src={icon} alt={icon.name} className="sidenav-icon"/>
            <p className={isActive ? "active-sidenav-title" : "sidenav-title"}>{title}</p>
        </div>
    )
}