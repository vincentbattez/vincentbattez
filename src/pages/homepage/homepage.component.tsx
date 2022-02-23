import React from 'react';

import { ImageSection } from './imageSection/imageSection.component'

import './homepage.component.scss';
import { homepageData } from '../../data/homepage/homepage.data'

export function Homepage() {
  return (
    <section className="page-homepage container">
      <ImageSection
        image={homepageData.image}
      />
    </section>
    );
}
