# youtube-playlist

A frontend-only React app for practising with YouTube videos.

Live at <https://raphaelbp12.github.io/youtube-playlist/>.

## Features

- **Loop a section of a video**: paste a YouTube link, choose a start and end
  time with the two-knob slider or the text inputs (`m:ss.s`), and the video
  jumps back to the start whenever it reaches the end.
- **Repeats**: choose how many times the section plays before moving on
  (default 1). There is only one section for now, so playback wraps around to
  it and keeps looping; the "Play x of y" counter starts over each round.
- **Shareable links**: the page URL keeps the video and loop
  (`?v=ID&start=83.5&end=97&repeat=3`), so you can bookmark or share it.

## Development

```sh
npm install
npm run dev      # start the dev server (http://localhost:5173/youtube-playlist/)
npm test         # unit tests (Vitest)
npm run lint     # oxlint
npm run build    # type-check and build to dist/
```

## Deployment

GitHub Actions (`.github/workflows/ci.yml`) runs lint, tests and build on
every pull request and push. Pushes to `main` that pass are deployed to GitHub
Pages. The repo's Pages source must be set to **GitHub Actions**.

Built with Vite, React, TypeScript, [Mantine](https://mantine.dev) and the
[YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference).

test again
