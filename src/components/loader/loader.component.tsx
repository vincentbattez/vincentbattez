import React, {useEffect, useState} from "react";

import './loader.component.scss'

export function Loader() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < 3) {
        // @ts-ignore
        setDots(oldArray => [...oldArray, '.'])
      } else {
        // @ts-ignore
        setDots(['.'])
        i=1
        return
      }

      i++
    }, 600)

    return () => clearInterval(interval);
  }, [dots]);

  return (
    <div className="loader-container">
      <div className="lds-ripple">
        <div/><div/>
      </div>
      <p className="mb-0">
        Redirection en cours
        <span className="loader__dots">{dots.join('')}</span>
      </p>
    </div>
  )
}
