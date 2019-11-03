import React, { Component } from 'react';

import './Timeline.css';
import twitterLogo from '../twitter.svg';
import api from '../services/api';
import Tweet from '../components/Tweet';
import socket from 'socket.io-client';

export default class Timeline extends Component {
   state = {
      tweets: [],
      newTweet: '',

   };

   async componentDidMount() {
      this.subscribeToEvents();
      await api.get('tweets').then(response => {
         this.setState({ tweets: response.data })
      });

      // this.setState({tweets: response.data})
   }

   subscribeToEvents = () => {
      const io = socket('http://localhost:3000');

      io.on('tweet', data => { 
         console.log('tweet: ', data)
         this.setState({tweets: [data, ...this.state.tweets]})
      })

      io.on('like', data => { 
         this.setState({
            tweets: this.state.tweets.map(
                tweet => (tweet._id === data.id ? data : tweet)   
            )
        })
         console.log('like: ', data)
      })
   }

   handleInputChange = e => {
      this.setState({ newTweet: e.target.value })
   }

   handleNewTweet = async e => {
      if (e.keyCode !== 13) return;

      const content = this.state.newTweet;
      const author = localStorage.getItem('@GoTweeter:username');

      await api.post('tweets', { content, author });

      this.setState({ newTweet: '' });
   }

   render() {
      return (
         <div className="timeline-wrapper">
            <img height={24} src={twitterLogo} alt='bla' />
            <form>
               <textarea
                  value={this.state.newTweet}
                  onChange={this.handleInputChange}
                  onKeyDown={this.handleNewTweet}
                  placeholder="Fala truta ...">
               </textarea>
            </form>
            <ul className="tweet-list">
               {
                  this.state.tweets.map(tweet => (
                     <Tweet key={tweet._id} tweet={tweet} />
                  ))
               }
            </ul>
         </div>
      );
   }
}
