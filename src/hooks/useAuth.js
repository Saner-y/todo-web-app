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
import {doc, setDoc, getDoc} from "firebase/firestore";
import {
    errorHandling,
    ValidationError,
    TermsAgreementError,
    MissingFieldsError,
    MissingEmailAddress
} from '../utils/ErrorHandling.js';
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const validatePasswords = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            throw new ValidationError('Şifreler eşleşmiyor');
        }
        
        // Güçlü şifre kontrolü
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new ValidationError('Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir');
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
        // Hassas verileri temizle
        const sanitizedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            role: 'user'
        };
        await setDoc(doc(firestore, `users/${uid}`), sanitizedData);
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
            const response = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(response.user);
            console.log(response.user);
            return response;
        } catch (error) {
            errorHandling(error);
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            await saveUserData(user.uid, {
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                username: user.email?.split('@')[0] || ''
            });
            
            setCurrentUser(user);
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
            setCurrentUser(user);
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
            setCurrentUser(null);
            return 'Logged out successfully!';

        } catch (error) {
            errorHandling(error);
        }
    };

    const getUserDetails = async () => {
        try {
            if (!currentUser?.uid) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }
            
            const userDocRef = doc(firestore, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                return userDocSnap.data();
            }
            return null;
        } catch (error) {
            console.error('Kullanıcı bilgileri alınırken hata:', error);
            return null;
        }
    };

    return {
        currentUser,
        loading,
        register, 
        loginWithEmail, 
        loginWithGoogle, 
        loginWithTwitter, 
        forgotPassword, 
        logout,
        getUserDetails
    };
};