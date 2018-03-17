import React, { Component } from 'react'
import { Card, CardImg, CardText, CardBody, Button, CardTitle, CardLink, Modal, ModalBody } from 'reactstrap'
import './App.css'
import '../env'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      feed: [],
      requestFailed: false
    }
  }

  componentDidMount () {
    fetch(`https://graph.facebook.com/v2.9/1758792264412132?fields=name,description,feed.limit(10){from,story,message,permalink_url,link,created_time,full_picture,comments{from,message,created_time,comments},reactions{type}}&access_token=`+access_token)
      .then(console.log('Fetch successful'))
      .then(response => {
        if (!response.ok) {
          throw Error('Error fetching API!')
        }
        return response
      })
      .then(data => data.json())
      .then(data => {
        var reactionCount = [], commentCount = [], commentDetails = [], imglink = [], posts = []

        for (var i = 0; i < data.feed.data.length; i++) {
          !data.feed.data[i].reactions ? reactionCount.push(0) : reactionCount.push(data.feed.data[i].reactions.data.length)

          !data.feed.data[i].comments ? commentCount.push(0) : commentCount.push(data.feed.data[i].comments.data.length)

          if (commentCount[i] === 0) {
            commentDetails.push('')
          } else {
            commentDetails.push(
              data.feed.data[i].comments.data.map(comment => {
                return (
                  <div>
                    <Card id='parent'>
                      <CardTitle>{comment.from.name}</CardTitle>
                      <CardText>{comment.created_time.substring(0, 10)} at {data.feed.data[i].created_time.substring(11, 16)}</CardText>
                      <CardText>{comment.message}</CardText>


                    {(comment.comments) && comment.comments.data.map(reply => {
                      return (
                        <Card id='child'>
                          <CardTitle>{reply.from.name}</CardTitle>
                          <CardText>{reply.created_time.substring(0, 10)} at {data.feed.data[i].created_time.substring(11, 16)}</CardText>
                          <CardText>{reply.message}</CardText>
                        </Card>
                      )
                    })}
                    </Card>

                    <br />
                    <br />
                  </div>
                )
              })
            )
          }

          !data.feed.data[i].full_picture && !data.feed.data[i].link ? imglink.push(' ') : imglink.push(<CardLink href={data.feed.data[i].link}><CardImg src={data.feed.data[i].full_picture} /></CardLink>)

          posts.push(
            <Card>
              <CardBody>
                <CardTitle>{data.feed.data[i].from.name}</CardTitle>
                <CardText>{data.feed.data[i].created_time.substring(0, 10)} at {data.feed.data[i].created_time.substring(11, 16)}</CardText>
                <CardText>{data.feed.data[i].message}</CardText>
              </CardBody>
              {imglink[i]}
              <CardBody>
                <Button><a href={data.feed.data[i].permalink_url}>{reactionCount[i]} reactions</a></Button>                                <Button onClick={this.toggle}>{commentCount[i]} comments</Button>
              </CardBody>
              <CardBody>
                {commentDetails[i]}
              </CardBody>
            </Card>
          )
        }
        this.setState({
          name: data.name,
          description: data.description,
          feed: posts
        })
      }, () => {
        this.setState({
          requestFailed: true
        })
      })
  }

  render () {
    return (
      <div className='container'>
        <div className='head'>
          <p id='title'>{this.state.name}</p>
          <p id='about'>{this.state.description}</p>
        </div>
        <div className='body'>
          <div>{this.state.feed}</div>
        </div>
      </div>
    )
  }
}

export default App
