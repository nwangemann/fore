# Dashboard

`src/features/dashboard`: the page header (logo, place pill, Re-tee refresh), footer credits, and `useDashboard`, which loads forecast, air and alerts in parallel and refreshes data older than 10 minutes. Data for a previous place or unit system is never shown; a failed refresh keeps the last good forecast.
