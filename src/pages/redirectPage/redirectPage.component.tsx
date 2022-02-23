import React  from 'react';
import { useSearchParams, useParams } from "react-router-dom";

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
    call: 'https://meet.google.com/aao-endc-ygw',
    envoyer_message: 'https://www.linkedin.com/messaging/thread/new/',
    linkedin: 'https://www.linkedin.com/in/vincentbattez/',
    github: 'https://github.com/vincentbattez/',
    cv: 'https://drive.google.com/file/d/0B_qtZh6a-s4cVTFkMU42bU9LTU0/view?resourcekey=0-77krpT-fBdI0BbSikISLBQ',
  }
}

function Redirect() {
  // @todo: redirection loader
  return <div>Redirection en cours...</div>
}

export function RedirectPage() {
  const {redirectId} = useParams()
  // @ts-ignore
  const redirectHref = lookupTable.redirectId[redirectId]
  const urlQueryCollection = Object.fromEntries(useSearchParams()[0])

  // 🚪 Redirect to Homepage
  if (!redirectId || !redirectHref) {
    window.location.replace("/")
    return <Redirect />
  }

  // 🚪 Redirect to external URL
  if (!urlQueryCollection.s || urlQueryCollection.utm_source) {
    window.location.replace(redirectHref)
    return <Redirect />
  }

  // 🚪 Redirect to UTM url
  // @ts-ignore
  const source = lookupTable.source[urlQueryCollection.s]
  const utmUrlRedirect = new URL(window.location.origin + window.location.pathname);
  utmUrlRedirect.searchParams.append("utm_source", source);

  window.location.replace(utmUrlRedirect.href)

  return <Redirect />;
}
