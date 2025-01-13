import MainInput from "../../components/inputs/MainInput/MainInput.jsx";
import {useState} from "react";
import './Register.css'
import MainButton from "../../components/buttons/MainButton/MainButton.jsx";
import {register} from "../../hooks/useAuth.js";

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    function onSubmit () {
        if (isChecked) {
            register({firstName, lastName, username, email, password, confirmPassword}).then (r => console.log(r));
        } else {
            alert('Please accept the terms!')
        }
    }

    return (
        <div className="form">
            <img className="register-image" src="src/assets/register-image.png" alt="register-image"/>
            <div className="form-input">
                <h2 className="title">Sign Up</h2>
                <MainInput icon="src/assets/user-react.svg" iconAlt="user" placeholder="Enter First Name"
                           text={firstName}
                           onChange={(e) => setFirstName(e.target.value)}/>
                <MainInput icon="src/assets/user-react.svg" iconAlt="user" placeholder="Enter Last Name" text={lastName}
                           onChange={(e) => setLastName(e.target.value)}/>
                <MainInput icon="src/assets/user-react.svg" iconAlt="user" placeholder="Enter Username" text={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                <MainInput icon="src/assets/mail-react.svg" iconAlt="user" placeholder="Enter E-mail Adress"
                           text={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                <MainInput icon="src/assets/lock-react.svg" iconAlt="user" placeholder="Enter Password" text={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                <MainInput icon="src/assets/lock-react.svg" iconAlt="user" placeholder="Confirm Your Password"
                           text={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <label className="checkbox"><input type="checkbox" onClick={() => setIsChecked(!isChecked)} checked={isChecked}/>I agree to all terms</label>
                <MainButton text="Register" onClick={onSubmit}/>
                <p className="sign-in-question">Already have an account? <a className="sign-in">Sign In</a></p>
            </div>
        </div>
    )
}