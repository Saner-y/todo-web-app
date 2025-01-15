import MainInput from "../../components/inputs/MainInput/MainInput.jsx";
import {useState} from "react";
import './Register.css'
import MainButton from "../../components/buttons/MainButton/MainButton.jsx";
import {useAuth} from "../../hooks/useAuth.js";
import {ToastContainer, toast, Zoom} from 'react-toastify';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const inputs = [
        { id: 'firstName', placeholder: 'Enter First Name', icon: 'src/assets/user-react.svg', type: 'text' },
        { id: 'lastName', placeholder: 'Enter Last Name', icon: 'src/assets/user-react.svg', type: 'text' },
        { id: 'username', placeholder: 'Enter Username', icon: 'src/assets/user-react.svg', type: 'text' },
        { id: 'email', placeholder: 'Enter E-mail Address', icon: 'src/assets/mail-react.svg', type: 'email' },
        { id: 'password', placeholder: 'Enter Password', icon: 'src/assets/lock-react.svg', type: 'password' },
        { id: 'confirmPassword', placeholder: 'Confirm Your Password', icon: 'src/assets/lock-react.svg', type: 'password' },
    ];

    function handleInputChange(e, id) {
        setFormData((prev) => ({ ...prev, [id]: e.target.value }));
    }

    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const register = useAuth().register;

    async function onSubmit() {
        setLoading(true);
        try {
            if(!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error('All fields are required!');
                return;
            }
            const resp = await register({...formData, isChecked});
            toast.success(resp);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="form">
            <img className="register-image" src="src/assets/register-image.png" alt="register-image"/>
            <div className="form-input">
                <h2 className="title">Sign Up</h2>
                {inputs.map(({ id, placeholder, icon, type }) => (
                    <MainInput
                        key={id}
                        icon={icon}
                        placeholder={placeholder}
                        text={formData[id]}
                        type={type}
                        onChange={(e) => handleInputChange(e, id)}
                    />
                ))}
                <label className="checkbox"><input type="checkbox" onClick={() => setIsChecked(!isChecked)} checked={isChecked}/>I agree to all terms</label>
                {loading && <p>Registering...</p>}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Zoom}/>
                {!loading && <MainButton text="Register" onClick={onSubmit}/>}
                <p className="sign-in-question">Already have an account? <span className="sign-in">Sign In</span></p>
            </div>
        </div>
    )
}