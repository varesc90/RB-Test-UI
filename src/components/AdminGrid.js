import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap'
import axios from 'axios'
import Cookies from 'universal-cookie/lib'

const LoginForm = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
    }
  }

  const login = (e) => {
    axios.post(`http://localhost/api/login`, { email, password }).then((res) => {
      props.setToken(res.data.data.api_token)
      console.log(res.data.data.api_token);
      const cookies = new Cookies()
      cookies.set('token', res.data.data.api_token, { path: '/' })
    }).catch((err) => {
      alert(err)
    })
  }

  return (<Container>
    <Col md={{ size: 4, offset: 4 }}>
      <label>LOGIN</label>
      <Row>
        <InputGroup>
          <Input placeholder="email" name="email" value={email} onChange={handleChange}/>
        </InputGroup>
      </Row>
      <br/>
      <Row>
        <InputGroup>
          <Input type="password" placeholder="password" value={password} name="password" onChange={handleChange}/>
        </InputGroup>
      </Row>
      <br/>
      <Row>
        <Button onClick={login} color="primary">Login</Button>
      </Row>
    </Col>
  </Container>)

}

export default LoginForm