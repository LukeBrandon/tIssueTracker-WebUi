import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import bcrypt from 'bcryptjs';
import Router from 'next/router'

export default function LoginPage(){

    const [createAccount, setcreateAccount] = useState<boolean>(false);

    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>("");
    const [confirmPassword, setconfirmPassword] = useState<string>("");


    const [firstName, setfirstName] = useState<string>("");
    const [lastName, setlastName] = useState<string>("");

    const [failedLoginVisible, setfailedLoginVisible] = useState<boolean>(false);
    const [createAccountError, setcreateAccountError] = useState<string>("");


    function handleEmailChange(e){
        setemail(e.target.value);
    }

    function handlePasswordChange(e){
        setpassword(e.target.value);
    }

    function handleFirstNameChange(e){
        setfirstName(e.target.value);
    }

    function handleLastNameChange(e){
        setlastName(e.target.value);
    }

    function handleConfirmPasswordChange(e){
        setconfirmPassword(e.target.value);
    }

    function clearInputs(){
        setemail("");
        setpassword("");
        setconfirmPassword("");
        setfirstName("");
        setlastName("");
    }


    async function submitLogin(){
        setfailedLoginVisible(false);

        const loginData = {
            email: email,
            password: password,
        };


        const res = await fetch(`${process.env.API_URL}/user/login`, {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(loginData)
        });
        res.json()
            .then(res => {
                console.log(res);
                if(res.success == true){
                    clearInputs();
                    setfailedLoginVisible(false);
                    localStorage.setItem("tissuetracker-userId", res.userId);
                    Router.push('/dashboard');
                } else {
                    setpassword("");
                    setfailedLoginVisible(true);
                }
                console.log(res)
            })
            .catch(err => console.log(err));

    }

    async function submitCreateAccount(){
        let hashedPassword;

        if(password === confirmPassword){
            console.log("matches");
            hashedPassword = bcrypt.hashSync(password, 10);

        } else {
            console.log("passwords no match");
            setpassword("");
            setconfirmPassword("");
            return;
        }  

        setpassword("");
        setconfirmPassword("");

        const createAccountData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        };

        console.log(createAccountData);

        const res = await fetch(`${process.env.API_URL}/user/new`, {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(createAccountData)
        });
        res.json()
            .then(res => {
                console.log(res);
                if(res.success == true){
                    clearInputs();
                    setcreateAccountError("");
                    localStorage.setItem("tissuetracker-userId", res.userId);
                    Router.push('/dashboard');
                } else {
                    setcreateAccountError(res.message || "Something went wrong");
                    setpassword("");
                }
            })
            .catch(err => console.log(err));
    }

    return(
        <>
        {createAccount &&
        <>
            <TextField
                autoFocus
                value={firstName} 
                onChange={handleFirstNameChange}
                margin="dense"
                id="firstName"
                label="FirstName"
                type="text"
                fullWidth
            />
            <TextField
                autoFocus
                value={lastName} 
                onChange={handleLastNameChange}
                margin="dense"
                id="lastName"
                label="LastName"
                type="text"
                fullWidth
            />  
          </>
        }
        <TextField
            autoFocus
            value={email} 
            onChange={handleEmailChange}
            margin="dense"
            id="Email"
            label="Email"
            type="text"
            fullWidth
          /> 
          <TextField
            autoFocus
            value={password} 
            onChange={handlePasswordChange}
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          /> 
        {failedLoginVisible && <p className={styles.error}>Invalid email or password</p>}
        {createAccount && 
             <TextField
                autoFocus
                value={confirmPassword} 
                onChange={handleConfirmPasswordChange}
                margin="dense"
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
            /> 
        }
        {createAccountError.length > 0 && <p className={styles.error}>{createAccountError}</p>}

        {!createAccount && <Button onClick={submitLogin} color="primary">Submit</Button>   } 
        {createAccount && <Button onClick={submitCreateAccount} color="primary">CreateAccount</Button>   }   

        {!createAccount && <a onClick={() => setcreateAccount(true)}>Create Account</a> }
        {createAccount && <a onClick={() => setcreateAccount(false)}>Login</a> }

        </>
    );
}
