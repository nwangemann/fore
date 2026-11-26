# 6. Par is the seasonal normal

- Status: accepted
- Date: 2026-11-25

## Context

The first scorecard scored days against a fixed ideal (18–26 °C, dry, calm). In a normal November every day was over par, so the score said nothing all winter.

## Decision

Par is a normal day for this place and time of year: the average of the last ten full years within a week either side of the date, from the Open-Meteo archive. Warmer, drier and calmer than normal is under par; rain costs less where rain is usual. It never goes under par below 5 °C or above 35 °C. The archive is fetched once per place per year and cached. Until it loads, the fixed ideal is used. The week total was dropped for "best day to play".
