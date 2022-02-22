import React from 'react';

import { SocialProps, Social } from './social.component'
import './socialCollection.component.scss'

export function SocialCollection({ socialCollection}: SocialCollectionProps) {
  return (
    <div className="social-collection ml-4">
      {socialCollection.map(({ url, image, dataAnalyticsLabel, className  }, key) =>
        <Social
          key={key}
          url={url}
          className={className}
          image={image}
          dataAnalyticsLabel={dataAnalyticsLabel}
        />
      )}
    </div>
  );
}

type SocialCollectionProps = {
  socialCollection: SocialProps[]
  className?: string
}
