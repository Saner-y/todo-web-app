import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const register = async({firstName, lastName, username, email, password, confirmPassword}) => {

    if (password === confirmPassword){
        try{
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const createResponse = await firebase.firestore().doc(`users/${response.user.uid}`).set({
                firstName,
                lastName,
                username,
                email
            })
            return alert('User created successfully!')
        }catch (e) {
            alert({e})
            console.log(e);
        }
    } else {
        return alert('Passwords do not match!')
    }
}