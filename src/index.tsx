import React from 'react';
import ReactDOM from 'react-dom';
import TagManager, { TagManagerArgs } from 'react-gtm-module'

import { RedirectPage } from "./pages/redirectPage/redirectPage.component";
import { Homepage } from './pages/homepage/homepage.component';
import { Navbar } from "./components/navbar/navbar.component";
import { HashtagCollection } from "./components/hashtag/hashtagCollection.component";

import './styles/index.scss';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const tagManagerArgs: TagManagerArgs = {
  gtmId: process.env.REACT_APP_GTM_ID || ''
}

TagManager.initialize(tagManagerArgs)

ReactDOM.render(
  <React.Fragment>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/go/:redirectId' element={<RedirectPage />} />
        <Route path="*" element={<RedirectPage />} />
      </Routes>
      <div className="container">
        <HashtagCollection />
      </div>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
