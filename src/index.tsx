import React from 'react';
import ReactDOM from 'react-dom';

import { Homepage } from './pages/homepage/homepage.component';
import { Navbar } from "./components/navbar/navbar.component";
import { HashtagCollection } from "./components/hashtag/hashtagCollection.component";

import './styles/index.scss';
import * as serviceWorker from './serviceWorker';
import { GoogleAnalytics } from "./services/google/analytics";

window.$googleAnalytics = new GoogleAnalytics()

ReactDOM.render(
  <React.Fragment>
    <Navbar />
    <Homepage />
    <div className="container">
      <HashtagCollection />
    </div>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
