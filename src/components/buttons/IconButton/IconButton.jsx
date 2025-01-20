import './IconButton.css'

export default function IconButton({icon, onClick, alt}) {
    return (
        <div className="icon-button-container">
            <img src={icon} alt={alt} className='icon-button' onClick={onClick}/>
        </div>
    )
}