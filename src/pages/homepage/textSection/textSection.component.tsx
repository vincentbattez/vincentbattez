import React from 'react';

import { SocialCollection } from "../../../components/social/socialCollection.component";
import './textSection.component.scss'
import { socialCollectionData } from "../../../data/homepage/socialCollection.data";
import externalLink from '../../../assets/icons/external-link.svg'

export function TextSection({ className, subTitle, title, description, cv }: TextSectionProps) {
  return (
    <div className={`${className} text-section`}>
      <h1 className="h2 mt-0 mb-3 text-section__subtitle">{subTitle}</h1>
      <h2 className="h1 mt-0 mb-2 text-section__title">{title}</h2>
      <p className="p mt-0 mb-4 text-section__description">{description}</p>

      <a
        className="link external"
        href={cv.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cv.label}
        <img
          className="icon icon-external-link"
          src={externalLink}
          alt=""
        />
      </a>
      <SocialCollection
        socialCollection={socialCollectionData}
      />
    </div>
  );
}

type TextSectionProps = {
  subTitle: string
  title: string
  description: string
  cv: {
    url: string
    label: string
  }
  className?: string
}
