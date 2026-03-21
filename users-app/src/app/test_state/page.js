"use client"
import { useState } from "react";

export default function TestState(){
    const [username, setUsername] = useState("");

    return(
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
            
            <br />

            <span>Your usename is{username}</span>
        </div>
    )
}