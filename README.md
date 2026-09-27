# StreamPulse

A QoE dashboard for a video streaming service. It shows what went wrong and who was affected. Built with React 18, TypeScript (strict), and Vite, on top of the mock API in `src/api/`. The mock API is unmodified and keeps its 12% failure rate.

## Setup

Requires Node 20 or newer.

```bash
cd streampulse
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

- `npm run build`: type-check and build for production
- `npm run lint`: ESLint
- `npm test`: Vitest unit tests (formatters and utils)

## Stack

TanStack Query handles fetching, caching, retries, and request cancellation. With `keepPreviousData`, the chart and table stay on screen while new data loads. 
Recharts draws the time-series chart, and MUI provides the selects, table, and pagination. 
Tailwind CSS v4 handles layout and the theme tokens behind the dark/light toggle. 
React Router keeps the whole dashboard state in the URL, so a copied link opens the same view in a new tab. The metric is the path (`/rebufferRatio`), and everything else is a query param: range, device, country, CDN, chart group-by, and the breakdown's dimension, search, sort, and page. For example:

```text
/rebufferRatio?range=last-24-hours&device=SmartTV&cdn=Fastly&groupBy=cdn&dimension=cdn&sortBy=plays&page=2
```

Default values are left out of the URL, and invalid ones fall back to the default. Changing a filter resets the table to page 1.

## Layout

Code is grouped by feature under `src/components/`:

- `dashboard/`: the page itself
- `navbar/` and `filters/`: header, filters, and filter state
- `metricPanel/`: the six metric cards
- `chart/`: the time series with group-by
- `breakdown/`: the table, with search, sort, and pagination handled server-side
- `common/`: shared empty and error states

API hooks live in `src/api/hooks.ts`. Formatting helpers and their tests live in `src/utils/`.

## AI tools used

I used Claude for help with component scaffolding of table, charts, a QA against the assignment brief. I reviewed every change it made and can explain the code.

## Incident investigation

SmartTV playback served through Fastly degraded for about 15 hours. Startup time more than doubled, and rebuffering and playback errors rose in the same window.

The mock data is generated relative to the current time, so the dates move with the day you run it. The times below are from my run (range: Last 7 days, local time).

### Summary

- **Affected CDN:** Fastly
- **Affected device:** SmartTV
- **Approximate time:** Sep 23, ~2:30 PM to Sep 24, ~5:30 AM (about 15 hours, or five 3-hour buckets)
- **Approximate impact:** avg startup time for Fastly rose from ~2,100+ ms to ~3,400+ ms. For SmartTV it rose from ~2,300+ ms to ~3,100+ ms. For SmartTV on Fastly it peaked near 6,400+ ms, against a normal ~2,800+ ms.

### Affected CDN: Fastly

With the chart grouped by CDN, only the Fastly line spikes on Sep 23. Akamai and CloudFront stay flat through the same window. A problem on the player side or in the content would show up on every CDN, so the cause sits with Fastly delivery.

### Affected device: SmartTV

With CDN filtered to Fastly and the chart grouped by Device Type, only SmartTV spikes. Other devices on Fastly stay at their normal level. SmartTVs on other CDNs are also normal. The problem only appears when both conditions hold: a SmartTV streaming from Fastly.

### Approximate time

The chart uses 3-hour buckets. For SmartTV on Fastly, startup time sits near ~2,800 ms all week. It jumps to about 6,400 ms at the bucket starting around 2:30 PM on Sep 23. It stays around 6,100–6,400 ms for three buckets, falls to about 4,400 ms in the fourth, and is back to normal by about 5:30 AM on Sep 24.

### Approximate impact

- **Startup time:** at the peak, SmartTV on Fastly took about 2.3x longer to start (≈6,400 ms vs ≈2,800 ms). The spike was large enough to move the wider numbers too: Fastly's average across all devices rose from ~2,100 ms to ~3,400 ms, and SmartTV's across all CDNs from ~2,300 ms to ~3,100 ms.
- **Across the whole 7 days:** one 15-hour incident was enough to pull the weekly average for SmartTV on Fastly up to 3,065 ms, 13.9% worse than the previous period's 2,691 ms.
- **Other metrics:** over the same filter, rebuffering ratio is up 19.5% (1.04% → 1.24%), playback error rate is up 12.8% (0.71% → 0.80%), and avg bitrate is slightly down (4,523 → 4,501 kbps).
- **Reach:** SmartTV on Fastly carried about 161K plays over the week. Viewers who started a stream during the window had a noticeably slower start and more stalls.

### How I identified it

1. On the default 7-day range, I checked each metric card. Avg Startup Time, Rebuffering Ratio, and Playback Error Rate were all marked "worse" than the previous period, so something had degraded.
2. I selected Avg Startup Time. The chart showed one clear spike on Sep 23 against an otherwise flat line, so it was a single incident, not a slow drift.
3. I set Group by to CDN. Only Fastly spiked, which pointed to the CDN.
4. I filtered CDN = Fastly and switched Group by to Device Type. Only SmartTV spiked, which pointed to the device.
5. I added the SmartTV filter and checked the breakdown table by Device Type and by CDN. Both show a single row (SmartTV / Fastly, 3,065 ms, 161K plays, 100% share), which confirms the filtered view contains only that combination.
6. I read the start and end of the spike from the 3-hour buckets to get the time window, and compared the peak with the flat baseline to estimate the impact.
