import './MainInput.css'

export default function MainInput({icon, iconAlt, placeholder, text, onChange}) {

    return (
        <div className="wrapper">
            <img src={icon} alt={iconAlt} className='icon'/>
            <input onChange={onChange} value={text} placeholder={placeholder} className='input'/>
        </div>
    )
}