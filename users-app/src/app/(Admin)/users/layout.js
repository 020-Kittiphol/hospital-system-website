"use client"

import 'bootstrap/dist/css/bootstrap.min.css';

import { use, useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function SignIn({ children}) {

    useEffect(() => {
        console.log(localStorage.getItem("access_token"));
        if(localStorage.getItem("access_token") === "notoken"){
            redirect("/signin");
        }
    }, []);

    return(
        <div>
            <div> 
                <h2>หน้าลงทะเบียน</h2>
            </div>

            {children}

            <div>
                <h4>footer</h4>
            </div>
        </div>
    );
}    
