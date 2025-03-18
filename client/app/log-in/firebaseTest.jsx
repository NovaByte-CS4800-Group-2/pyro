import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

export const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 

    // Handle sign-in
    const handleSignin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(""); // Reset any previous error messages
        
        try {
            // Attempt to sign in with email and password
            await firebase.auth().signInWithEmailAndPassword(email, password);
            alert("User signed in successfully");
        } catch (err) {
            // If there's an error, set the error message
            setError(err.message); 
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            {/* Sign-in form */}
            <form onSubmit={handleSignin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                        required
                    />
                </div>
                <div>
                    <button type="submit">Sign In</button>
                </div>
            </form>

            {/* Show error message if there's an error */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
