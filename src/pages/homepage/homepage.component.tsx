import React from 'react';
import { Helmet } from "react-helmet";

import { TextSection } from './textSection/textSection.component'
import { ImageSection } from './imageSection/imageSection.component'

import './homepage.component.scss';
import { homepageData } from '../../data/homepage/homepage.data'

export function Homepage() {
  return (
    <section className="page-homepage container">
      <Helmet>
        <link rel="canonical" href="https://vincentbattez.dev" />
        <meta itemProp="name" content="🏆 Développeur Vue.js Sénior Freelance - Vincent Battez"/>
        <meta itemProp="description" content="✅ Développeur Front-End Sénior - Portfolio de Vincent Battez"/>
        <meta itemProp="image" content="https://s3.eu-west-3.amazonaws.com/vincentbattez.dev/opengraph-vincentbattez-dev.jpg"/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="🏆 Développeur Vue.js Sénior Freelance - Vincent Battez"/>
        <meta name="twitter:description" content="✅ Développeur Front-End Sénior - Portfolio de Vincent Battez"/>
        <meta name="twitter:site" content="@VincentBattez"/>
        <meta name="twitter:image:src" content="https://s3.eu-west-3.amazonaws.com/vincentbattez.dev/opengraph-vincentbattez-dev.jpg"/>
        <meta name="og:title" content="🏆 Développeur Vue.js Sénior Freelance - Vincent Battez"/>
        <meta name="og:description" content="✅ Développeur Front-End Sénior - Portfolio de Vincent Battez"/>
        <meta name="og:image" content="https://s3.eu-west-3.amazonaws.com/vincentbattez.dev/opengraph-vincentbattez-dev.jpg"/>
        <meta name="og:url" content="https://vincentbattez.dev/"/>
        <meta name="og:site_name" content="Développeur Vue.js Sénior Freelance - Vincent Battez"/>
        <meta name="og:locale" content="fr_FR"/>
        <meta name="og:type" content="website"/>
      </Helmet>

      <TextSection
        className="col-7 col-xs-12"
        subTitle={homepageData.subTitle}
        title={homepageData.title}
        description={homepageData.description}
        cv={homepageData.cv}
      />
      <ImageSection
        image={homepageData.image}
      />
    </section>
    );
}
