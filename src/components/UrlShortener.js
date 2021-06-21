import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap'
import axios from 'axios'

const UrlShortener = (props) => {
  const [url, setUrl] = useState('')
  const [age, setAge] = useState(7)
  const [result, setResult] = useState('')

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'url':
        setUrl(e.target.value)
        break
      case 'age':
        setAge(e.target.value)
        break
    }
  }

  //[Todo]: Investigate better way to check
  const generateUrl = () => {

    let validUrl = ''

    if (url.substring(0, 8) !== 'https://') {
      validUrl = 'https://' + url
    } else {
      validUrl = url
    }

    try {
      //check if URL is valid
      var regex = new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)')
      if (!regex.test(validUrl)) {
        throw 'Invalid'
      }
    } catch (_) {
      alert(url + ' is an invalid URL')
      return
    }
    axios.post(`http://localhost/api/urls`, { origin: validUrl, age }).then((res) => {
      setResult(res.data.data.shortenedUrl)
    }).catch((err) => {
      alert(err.response.data.message)
    })

  }

  return (<Container>
    <Col md={{ size: 4, offset: 4 }}>
      <h5><b>Shortener</b></h5>
      <span>(current blacklist : "/Test/")</span>
      <Row>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <Input placeholder="Url to be shorten" name="url" value={url} onChange={handleChange}/>
        </InputGroup>
      </Row>
      <br/>
      <Row>
        <InputGroup>
          <InputGroupAddon addonType="append">
            <InputGroupText>Expire in (Day)</InputGroupText>
          </InputGroupAddon>
          <Input placeholder="URL will be expire in" name="age" value={age} onChange={handleChange}/>
        </InputGroup>
      </Row>
      <br/>
      <Row>
        <InputGroup>
          <Input readOnly placeholder="result" value={result} name="result"/>
        </InputGroup>
      </Row>
      <br/>
      <Row>
        <Button onClick={generateUrl} color="primary">Generate</Button>
      </Row>
    </Col>
  </Container>)

}

export default UrlShortener