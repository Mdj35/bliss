import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import '../App.css';
import { Container,LoginBox,Title,ErrorMessage,Input,Button } from '../design/design';
import { Label,Link } from '../design/design';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = (e) => {
      e.preventDefault();
      if (email === 'library@hcdc.edu.ph' && password === 'password') {
        navigate('/user');
      } else {
        setError('Invalid credentials');
      }
    };
  
    return (
      <Container>
        <LoginBox>
          <Title>QuickShelf</Title>
          <p>SIGN IN</p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <form onSubmit={handleLogin}>
            <Label>Username</Label>
            <Input
              type="email"
              placeholder="Example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Submit</Button>
          </form>
          <Link href="#">Forgot Username?</Link>
          <Link href="#">Forgot Password?</Link>
        </LoginBox>
      </Container>
    );
  }
  
  export default Login;
  