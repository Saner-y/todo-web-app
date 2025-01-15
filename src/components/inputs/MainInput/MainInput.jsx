import {useState,useRef} from 'react'
import './MainInput.css'

export default function MainInput({icon, iconAlt, placeholder, text, onChange, type}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [typeText, setTypeText] = useState(type);
    const inputRef = useRef(null);

    return (
        <div className="wrapper">
            <img src={icon} alt={iconAlt} className='icon' onClick={() => {inputRef.current.focus()}}/>
            <input  ref={inputRef} onChange={onChange} value={text} placeholder={placeholder} className='input' type={typeText}/>
            {type === 'password' && <img src={isPasswordVisible ? "src/assets/non-visible-react.svg" : "src/assets/visible-react.svg"}
                  alt="visibility" className='visibility' onClick={() => {
                setIsPasswordVisible(!isPasswordVisible)
                setTypeText(isPasswordVisible ? 'password' : 'text')
            }}/>}
        </div>
    )
}