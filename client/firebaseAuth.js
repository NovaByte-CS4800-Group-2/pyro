import {useState} from "react"; 
import firebase from "./firebaseConfig"; 

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 

    const handleSignup = async (e) => {
        e.preventDefault(); 
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password); 
            alert("User registered successfully"); 
        }
        catch (err){
            setError(err.message) // Display errors 
        }
    }; 
}; 

export const Signin = () => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(""); 

    const handleSignin = async(e) => {
        e.preventDefault(); 
        try{
            await firebase.auth().signInWithEmailAndPassword(email, password)
            alert("user signed in successfully");
        } catch(err){
            setError(err.message); // display errors 
        }
    }
}

export const Signout = () => {
    cpm
}