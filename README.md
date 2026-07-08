# RoomCheck

So basically this is a mobile web demo I threw together for a business contest pitch. The idea is a hotel checkout assistant — instead of the front desk sending someone up to check the room, the guest just whips out their phone and the AI (well, fake AI, more on that later) runs through everything automatically.

The whole thing is in Japanese since the contest was in Japan. It's a mobile-first PWA kinda thing, no backend at all, no real AI API. Just enough UI to make the judges go "oh okay that's cool" during the pitch.

## Running it

Super simple:

```bash
npm install
npm run dev
```

Vite will boot up and give you a localhost URL, probably `http://localhost:5173/`. Open it on your phone (or devtools mobile mode) and you're good.

## What happens when you use it

1. First screen asks for camera access — this is real, uses `getUserMedia`. Works on localhost and HTTPS.
2. Tap `撮影してAI確認` (that's "shoot photo and AI check").
3. The app pretends to scan the room. There's a little loading animation. It's fake, just a timeout.
4. A checklist shows up with 6 items like "bed area," "desk," "bathroom" etc. Each one has a confidence percentage, estimated time, and a quote that sounds like something an AI would say.
5. Tap any item and it expands to show the actual hotel cleaning manual steps — like real Japanese hotel SOPs.
6. Tap `完了写真を撮る` ("take completion photo") and your camera opens again. Snap a pic.
7. Another fake AI check runs to pretend it's verifying your work.
8. If something comes back as "retry" it'll tell you what's wrong (mocked obviously).
9. If you're demoing in front of people and don't wanna go through all 6 items one by one, hit `デモ用に一括確認` ("batch check for demo") and it marks everything done instantly.
10. Tap `完了報告へ進む` ("proceed to completion report"), review what you've done, and send it off.
11. Last screen just says thanks with some room number and timestamp flavor text.

## Stuff to know

- **There's no backend.** Like at all. No API calls, no database, no server. Everything runs in the browser. It's purely a frontend demo.
- **The AI is completely faked.** All the "AI detected" percentages, the analysis quotes, the verification results — they're all hardcoded or randomly picked from a set of preset responses. For the pitch this is fine, you're just selling the concept.
- **Camera is real though.** It actually uses your phone camera via `getUserMedia`. The photos you take stay on your device, nothing gets uploaded anywhere (because again, no backend).
- **The room photo** is a generated image at `public/demo-room.png` that shows up when camera access is blocked or unavailable.
- **Design** is all laid out in `design.md` if you wanna see the thinking behind it. Warm eggshell background, taupe cards, black pill buttons, thin borders — tried to keep it restrained and premium without going overboard. Inspired by ElevenLabs and minimal Japanese design.

## Tech stack

- React (plain, no framework)
- Vite (bundler)
- Lucide React (icons)
- That's literally it. No router, no state management library, no CSS frameworks. Just a single `main.jsx` file with everything in it.

## File structure

```
roomcheck/
├── index.html          # Entry point
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── design.md           # Design system doc
├── README.md           # This file
├── public/
│   └── demo-room.png   # Fallback room image
└── src/
    ├── main.jsx        # All the React code
    └── styles.css      # All the styles
```

Yeah it's all in one file. For a pitch demo it's fine, keeps things simple. If this ever became a real product you'd obviously want to split it up.

## If you're judging this

The whole point is the UX flow feels real enough that a hotel exec watching the pitch goes "huh yeah I can see this working." It's a business contest thing, not production code. The mock AI buys you enough time to talk through the concept without getting bogged down in implementation details.
