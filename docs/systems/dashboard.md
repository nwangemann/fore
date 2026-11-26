# Dashboard

`src/features/dashboard`: the page header (logo, place pill, Re-tee refresh, when the card was signed), footer credits, and `useDashboard`.

`useDashboard` waits for saved settings to load, paints the last good result for that place and units from the cache ("From your last visit · updating…"), then loads forecast, air and alerts in parallel, and the seasonal normals after them. Data older than 10 minutes refreshes each minute and when the app returns to the foreground. Data for a previous place or unit system is never shown; a failed refresh keeps the last good forecast.

Follow me re-reads the device location on open and only switches places (and names the new one) after a move of 2 km or more.
