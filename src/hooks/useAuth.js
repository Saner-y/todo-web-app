// src/hooks/useAuth.js
// src/hooks/useAuth.js
import {auth, firestore} from "../api/firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut,
    GoogleAuthProvider,
    TwitterAuthProvider
} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {
    errorHandling,
    ValidationError,
    TermsAgreementError,
    MissingFieldsError,
    MissingEmailAddress
} from '../utils/ErrorHandling.js';

export const useAuth = () => {
    const validatePasswords = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            throw new ValidationError();
        }
    };

    const checkTermsAgreement = (isChecked) => {
        if (!isChecked) {
            throw new TermsAgreementError();
        }
    }

    const checkRequiredFields = (formData) => {
        if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            throw new MissingFieldsError();
        }
    }

    const checkEmail = (email) => {
        if (!email) {
            throw new MissingEmailAddress();
        }
    }

    const checkPassword = (password) => {
        if (!password) {
            throw new MissingFieldsError();
        }
    }

    const createUser = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const saveUserData = async (uid, data) => {
        await setDoc(doc(firestore, `users/${uid}`), data);
    };

    const register = async ({firstName, lastName, username, email, password, confirmPassword, isChecked}) => {
        try {
            checkRequiredFields({firstName, lastName, username, email, password, confirmPassword});
            validatePasswords(password, confirmPassword);
            checkTermsAgreement(isChecked);
            const response = await createUser(email, password);
            await saveUserData(response.user.uid, {firstName, lastName, username, email});
            return 'User created successfully!';
        } catch (error) {
            errorHandling(error);
        }
    };

    const loginWithEmail = async ({email, password}) => {
        try {
            checkEmail(email);
            checkPassword(password);
            await signInWithEmailAndPassword(auth, email, password);
            return 'Logged in successfully!';
        } catch (error) {
            errorHandling(error);
        }
    };


    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log('Logged in successfully!', user);
            return user;
        } catch (error) {
            errorHandling(error);
        }
    };

    const loginWithTwitter = async () => {
        try {const provider = new TwitterAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const credential = TwitterAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const secret = credential.secret;
            const user = result.user;
            console.log('Logged in successfully!', user);
            return user;
        } catch (error) {
            errorHandling(error);
        }
    }

    const forgotPassword = async ({email}) => {
        try {
            checkEmail(email);
            await sendPasswordResetEmail(auth, email);
            return 'Password reset e-mail sent successfully!';
        } catch (error) {
            errorHandling(error);
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return 'Logged out successfully!';
        } catch (error) {
            errorHandling(error);
        }
    };

    return {register, loginWithEmail, loginWithGoogle, loginWithTwitter, forgotPassword, logout};
};