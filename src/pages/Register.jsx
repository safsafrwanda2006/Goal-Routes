import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios'

function Register() {
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/register', values)
            .then((res) => {
                if (res.data.Status === "Success") {
                    navigate('/login');
                    console.log(res)
                }
                console.log(res)
            })
            .catch((err) => console.log(err))
    };

    return (
        <div className='pageContainer'>
            <div className="register-names">
                <h1>GoalRoute</h1>
                <p className="hero-text">
                    Turn big goals into clear, manageable steps and track your progress with confidence.
                </p>
            </div>
            <form
                onSubmit={handleSubmit}
                action="submit">
                <label htmlFor=""><h2>Sign up</h2></label>
                <div className='name-register'>
                    <input
                        type="text"
                        placeholder='First Name'
                        onChange={e => setValues({ ...values, firstname: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder='Last Name'
                        onChange={e => setValues({ ...values, lastname: e.target.value })}
                    />
                </div>
                <input
                    type="email"
                    placeholder='Email...'
                    onChange={e => setValues({ ...values, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder='Password'
                    onChange={e => setValues({ ...values, password: e.target.value })}
                />
                <button>Sign up</button>
                <p>Alredy have an account <Link to='/login'> Sign in</Link></p>
            </form>
        </div>
    )
}

export default Register