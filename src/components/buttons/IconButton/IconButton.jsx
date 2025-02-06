import './IconButton.css'

export default function IconButton({icon, onClick, alt}) {
    return (
        <div className="icon-button-container" onClick={onClick}>
            <img src={icon} alt={alt} className='icon-button' />
        </div>
    )
}