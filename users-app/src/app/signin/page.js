"use client"

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Form, Row, Col, Button } from 'react-bootstrap';
import md5 from 'md5';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();

    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        localStorage.setItem("access_token", "notoken");
    }, []);

    const getAuthenKey = async () => {
        var baseString = username + "&" + md5(password);
        var authenSignature = md5(baseString);

        const response = await fetch("http://localhost:8080/api/authen_request", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                authen_request: md5(username)
            })
        });

        const d = await response.json();
        return d;
    }

    const getAccessKey = async (authenKey) => {
        const response = await fetch("http://localhost:8080/api/access_request", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                auth_signature: md5(username + "&" + md5(password)),
                auth_key: authenKey.data
            })
        });

        const d = await response.json();
        return d;
    }

    const doSignIn = async () => {
        try {
            const authenKey = await getAuthenKey();
            const d = await getAccessKey(authenKey);
            console.log("d:", d);

            if(d.isErr){
                console.log("error:", d.errMessage);
                return;
            }

        localStorage.setItem("access_token", d.data.access_token);
        localStorage.setItem("user_id", d.data.user_info.user_id);
        localStorage.setItem("username", d.data.user_info.username);
        localStorage.setItem("first_name", d.data.user_info.first_name);
        localStorage.setItem("last_name", d.data.user_info.last_name);
        localStorage.setItem("role_id", d.data.user_info.role_id);
        localStorage.setItem("tel_num", d.data.user_info.tel_num);
        localStorage.setItem("address", d.data.user_info.address);
        localStorage.setItem("email", d.data.user_info.email);

        if (d.data.user_info.role_id === 1) {
            router.push("/users");
        }
        //}//else if (d.data.user_info.role_id === 2) {
        //  router.push("/patients");
        //}

        } catch(err) {
            console.log("error:", err); 
        }
    };

    const onSignIn = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            doSignIn();
        }
        setValidated(true);
    };

    return (
        <div className='container m-auto'>
            <Form noValidate validated={validated} onSubmit={onSignIn}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId='validateUsername'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='username'
                            onChange={(e) => setUsername(e.target.value)} />
                        <Form.Control.Feedback type='invalid'>กรุณากรอก Username</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId='validatePassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type='password'
                            placeholder='password'
                            onChange={(e) => setPassword(e.target.value)} />
                        <Form.Control.Feedback type='invalid'>กรุณากรอก Password</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Col md={3}>
                        <Button type='submit'>Sign In</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}