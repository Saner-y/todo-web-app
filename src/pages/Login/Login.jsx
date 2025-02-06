import MainInput from "../../components/inputs/MainInput/MainInput.jsx";
import {useState} from "react";
import {useAuth} from "../../hooks/useAuth.js";
import MainButton from "../../components/buttons/MainButton/MainButton.jsx";
import {toast, ToastContainer, Zoom} from "react-toastify";
import './Login.css'
import {useNavigate} from "react-router-dom";
import { loginIcons } from "../../assets/index.js";

export default function Login() {
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {loginWithEmail, loginWithGoogle, loginWithTwitter, forgotPassword} = useAuth();
    const navigate = useNavigate();

    const onSubmit = async () => {
        setLoading(true);
        try {
            const resp = await loginWithEmail({email, password});
            toast.success(resp);
            navigate('/dashboard');
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }

    const onForgotPassword = async () => {
        try {
            const resp = await forgotPassword({email});
            toast.success(resp);
        } catch (e) {
            toast.error(e.message);
        }
    }

    const googleLogin = async () => {
        try {
            await loginWithGoogle();
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (e) {
            toast.error(e.message);
        }
    }

    const twitterLogin = async () => {
        try {
            await loginWithTwitter();
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <div className="login-bg">
            <div className="form">
                <form onSubmit={(e) => {
                    e.preventDefault();
                }} className="form-input">
                    <h2 className="title">Sign In</h2>
                    <MainInput icon={loginIcons.mail} placeholder="Enter E-mail Address" type="email"
                               onChange={(e) => setEmail(e.target.value)} iconAlt="mail" text={email}/>

                    <MainInput icon={loginIcons.lock} placeholder="Enter Password" type="password"
                               onChange={(e) => setPassword(e.target.value)} iconAlt="password" text={password}/>
                    <div className="footer-input">
                        <label className="checkbox"><input type="checkbox" onClick={() => setIsChecked(!isChecked)}
                                                           checked={isChecked}/>Remember Me</label>
                        <p onClick={onForgotPassword} className="forgot-password">Forgot Password?</p>
                    </div>
                    {loading && <p>Signing in...</p>}
                    {!loading && <MainButton text="Sign in" onClick={onSubmit} type="submit"/>}
                    <hr/>
                    <div className="footer-div">
                        <div className="method-image-div">
                            <p>Login with</p>
                            <img src={loginIcons.google} alt="google" onClick={googleLogin}
                                 className="google"/>
                            <img src={loginIcons.x} alt="x" onClick={twitterLogin} className="x"/>
                        </div>
                        <p>Don&#39;t have an account? <span onClick={() => {
                            navigate('/register')
                        }} className="create-account">Create One</span></p>
                    </div>
                </form>
                <img className="login-image" src={loginIcons.image} alt="login-image"/>
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
            </div>
        </div>
    )
}