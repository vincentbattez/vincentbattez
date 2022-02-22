import React from 'react'

import './navbar.component.scss'

import externalLink from '../../assets/icons/external-link.svg'
import { navbarData } from "../../data/homepage/navbar.data";

export function Navbar() {
  const isAvailable = navbarData.isAvailable
  const disabledClassName = isAvailable
    ? ''
    : 'disabled'
  const LinkTag = isAvailable
    ? 'a'
    : 'span'
  const linkHref = isAvailable
    ? navbarData.link.url
    : ''

  return (
    <nav className={`main-navbar container mt-3 ${disabledClassName}`}>
      <div className="main-navbar__container col-12">
        <LinkTag
          className="main-navbar__text"
          target="_blank"
          rel="noopener noreferrer"
          href={linkHref}
        >
        <span className="main-navbar__dot mr-3" />
          <h3 className={`link ${disabledClassName}`}>
            {navbarData.link.label}
            <img
              className="icon icon-external-link"
              src={externalLink}
              alt=""
            />
          </h3>
        </LinkTag>
      </div>
    </nav>
  )
}
