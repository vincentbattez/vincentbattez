import React from "react";

import './imageSection.component.scss'

export function ImageSection({ image }: ImageSectionProps) {
  return (
    <div className="image-section col-5">
      <img
        src={image.url}
        alt="Vincent Battez Développeur Front-End"
      />
    </div>
  )
}

type ImageSectionProps = {
  image: {
    url: string
  }
}
