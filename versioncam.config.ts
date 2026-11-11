import { defineRecorder } from "versioncam";

export default defineRecorder({
  // vite.config.js sets server.port to 3000.
  baseUrl: "http://localhost:3000",
  webServer: {
    // The dev script, as CLAUDE.md describes it.
    command: "npm run dev",
    url: "http://localhost:3000",
    // vite.config.js opens a browser on start (server.open); Vite skips
    // that when BROWSER is "none", so a recording opens no window.
    env: { BROWSER: "none" },
  },
  viewport: { width: 1440, height: 900 },
  clips: "demos/clips/**/*.clip.ts",
  // Empty page below the test's options; the default rests on the words.
  cursorStart: { x: 0.82, y: 0.75 },
  // The clip types a line, then opens the theme list and picks a theme,
  // which takes longer than the default 9 to 11 seconds to show readably.
  review: { minSeconds: 15, maxSeconds: 20 },
});
