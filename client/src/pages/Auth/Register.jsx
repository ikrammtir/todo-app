import React, { useState } from 'react';
import styles from './Login.module.css';
import login from '../../assets/login.png';
import { Button, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../services/authServices';
import { getErrorMessage } from '../../util/GetError';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = {
        firstName,
        lastName,
        username,
        password
      };

      const response = await AuthServices.registerUser(data);
      console.log(response.data);

      message.success("You're Registered Successfully!");
      navigate('/login');

      setLoading(false);
    } catch (err) {
      console.log(err); // ✅ fixed typo
      message.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.login__card}>
        <img src={login} alt=".." />
        <h2>Register</h2>

        <div className={styles.input__inline__wrapper}>
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
          />

          <Input
            placeholder="Last Name"
            style={{ marginLeft: '10px' }}
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>

        <div className={styles.input__wrapper}>
          <Input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.input__wrapper}>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.input__info}>
          Existing User? <Link to="/login">Login</Link>
        </div>

        <Button
          loading={loading}
          type="primary"
          size="large"
          disabled={!username || !password}
          onClick={handleSubmit}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

export default Register;