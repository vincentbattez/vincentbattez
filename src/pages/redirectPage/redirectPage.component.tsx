import React, {Fragment, useEffect} from 'react';
import { useSearchParams, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Loader } from "../../components/loader/loader.component";

import './redirectPage.component.scss'

const lookupTable = {
  source: {
    sem: 'signature_email',
    lk: 'linkedin',
    cd: 'calendrier_description',
    mp: 'message_prive',
    pf: 'portfolio',
    qr: 'qr_code',
    cv: 'cv',
    gh: 'github',
  },
  redirectId: {
    recommandation: 'https://www.linkedin.com/in/vincentbattez/details/recommendations/edit/write/?profileUrn=urn%3Ali%3Afsd_profile%3AACoAABx8RLABL3SOZC3R86qDOhYgJZwNmmSBKWY',
    entretien: 'https://hub.flexibits.com/openings/vincentbattez/entretien/',
    call: 'https://meet.google.com/aao-endc-ygw',
    envoyer_message: 'https://www.linkedin.com/messaging/thread/new/',
    linkedin: 'https://www.linkedin.com/in/vincentbattez/',
    github: 'https://github.com/vincentbattez/',
    cv: 'https://drive.google.com/file/d/0B_qtZh6a-s4cVTFkMU42bU9LTU0/view?resourcekey=0-77krpT-fBdI0BbSikISLBQ',
  }
}

const metaCv = [
  {name:"description", content:"Développeur Front-End Sénior"},
  {name:"image", content:"https://s3.eu-west-3.amazonaws.com/vincentbattez.dev/opengraph-cv.jpg"},
  {itemProp:"name", content:"📃 CV - Vincent Battez"},
  {itemProp:"description", content:"Développeur Front-End Sénior"},
  {itemProp:"image", content:"https://s3.eu-west-3.amazonaws.com/vincentbattez.dev/opengraph-cv.jpg"},
  {name:"twitter:card", content:"summary"},
  {name:"twitter:title", content:"📃 CV - Vincent Battez"},
  {name:"twitter:description", content:"Développeur Front-End Sénior"},
  {name:"og:title", content:"📃 CV - Vincent Battez"},
  {name:"og:description", content:"Développeur Front-End Sénior"},
  {name:"og:image", content:"https://s3.eu-west-3.amazonaws.com/vincentbattez.dev/opengraph-cv.jpg"},
  {name:"og:url", content:"https://vincentbattez.dev/go/cv"},
  {name:"og:site_name", content:"📃 CV - Vincent Battez"},
  {name:"og:locale", content:"fr_FR"},
  {name:"og:type", content:"website"},
]

function Redirect({redirectHref}: RedirectProps) {
  const {redirectId} = useParams()
  const isCv = redirectId === 'cv'

  // Meta
  let meta: any[] = [
    {name:"robots", content:"noindex, nofollow"}
  ]
  const title = isCv
    ? "📃 CV - Vincent Battez"
    : "⏳ Redirection en cours..."

  if (isCv) {
    meta.push(...metaCv)
  }

  return (
    <Fragment>
      <Helmet meta={meta} title={title} />
      <section className="container">
        <div className='col-12 text-center'>
          <Loader />
          <a
            className="redirect-hint"
            href={redirectHref}
            rel="noopener noreferrer"
          >
            {redirectHref}
          </a>
        </div>
      </section>
    </Fragment>
  )
}

export function RedirectPage() {
  const {redirectId} = useParams()
  // @ts-ignore
  const redirectHref = lookupTable.redirectId[redirectId]
  const urlQueryCollection = Object.fromEntries(useSearchParams()[0])

  useEffect(() => {
    // ❌ Redirect to Homepage
    if (!redirectHref) {
      window.location.replace("/")

      return
    }

    // 📲 Send iOS notication
    if (redirectId === 'call') {
      const title = "Quelqu'un essaye de me joindre"
      const message = "Quelqu'un est passé par le lien \"vincentbattez.dev/go/call\""
      const url = lookupTable.redirectId.call
      const urlTitle = "Rejoindre l'appel"

      fetch(
      `https://api.pushover.net/1/messages.json
        ?token=${process.env.REACT_APP_PUSHEROVER_APP_TOKEN}
        &user=${process.env.REACT_APP_PUSHEROVER_USER_KEY}
        &title=${title}
        &message=${message}
        &url=${url}
        &url_title=${urlTitle}`,
      { method: 'POST' }
      )
    }

    // ➡️ Redirect to UTM url
    if (urlQueryCollection.s) {
      // @ts-ignore
      const source = lookupTable.source[urlQueryCollection.s]
      const utmUrlRedirect = new URL(window.location.origin + window.location.pathname);
      utmUrlRedirect.searchParams.append("utm_source", source);

      window.location.replace(utmUrlRedirect.href)
      return
    }

    // ✅ Redirect to external URL
    window.location.replace(redirectHref)
  }, [redirectHref, redirectId, urlQueryCollection.s])


  return <Redirect redirectHref={redirectHref} />;
}

type RedirectProps = {
  redirectHref?: string
}
