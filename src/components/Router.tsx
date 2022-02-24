import React from "react";
import {Route, Routes} from "react-router-dom";

import { Homepage } from "../pages/homepage/homepage.component";
import { RedirectPage } from "../pages/redirectPage/redirectPage.component";

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/go/:redirectId' element={<RedirectPage />} />
      <Route path="*" element={<RedirectPage />} />
    </Routes>
  )
}
