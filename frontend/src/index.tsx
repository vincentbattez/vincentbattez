import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

import { ApolloProvider } from "react-apollo";
import client from "./utils/apolloClient";

import Homepage from './pages/homepage/homepage.component';
import './styles/index.scss';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      <Homepage />
    </ApolloProvider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();