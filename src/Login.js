import React from 'react';
import "./Login.css";
import {Button} from "@material-ui/core";
import { auth,provider } from './firebase';
import {signInWithPopup} from "firebase/auth";
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';

function Login() {
    const [{user},dispatch]=useStateValue();
    
    const signIn = () =>{
        signInWithPopup(auth,provider).then((result) =>{
            dispatch({
                type:actionTypes.SET_USER,
                user:result.user,
            });
        })
            .catch((error) => alert(error.message));
    };

    return (
        <div className="login">
            <div className="login__container">
                <img src="https://logos-download.com/wp-content/uploads/2016/03/WhatsApp_Icon.png" alt="" />
                <div className="login__text">
                    <h1>Sign in to Whatsapp</h1>
                </div>
                <Button onClick={signIn}>
                Sign In with Google
                </Button>
            </div>
        </div>
    )
}

export default Login
