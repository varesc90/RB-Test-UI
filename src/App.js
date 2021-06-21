import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import UrlShortener from './components/UrlShortener'
import Cookies from 'universal-cookie/lib'
import axios from 'axios'
import AdminGrid from './components/AdminGrid'

export default function App () {
  const [apiToken, setApiToken] = useState('')
  const cookies = new Cookies()
  useEffect(() => {
    // Update the document title using the browser API

    if (!apiToken && cookies.get('token')) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token')
      }
      axios.post('http://localhost/api/ping', {}, { headers }).then((res) => {
        setApiToken(cookies.get('token'))
      }).catch((_) => {
        cookies.remove('token')
      })
    }

    return true
  })
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Url Shortener</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/admin">
            <Admin token={apiToken} setToken={setApiToken}/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

function Home () {
  return <UrlShortener/>
}

function Admin (props) {
  const isLogin = props.token !== ''
  if (isLogin) {
    return <AdminGrid token={props.token} />
  } else {
    return <LoginForm setToken={props.setToken}/>
  }
}


