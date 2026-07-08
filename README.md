# RoomCheck AI Demo

Japanese mobile web demo for a hotel guest checkout assistant. The AI behavior is intentionally mocked for a business contest pitch.

## Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173/`.

## Demo Flow

1. Allow camera access on the first screen.
2. Tap `撮影してAI確認`.
3. Wait for the mocked AI scan.
4. Expand checklist items to show the Japanese hotel manual steps.
5. Tap `完了写真を撮る`; the camera opens again for that task.
6. Take the completion photo and watch the mocked AI confirmation screen.
7. Use `デモ用に一括確認` if you want to move quickly during the pitch.
8. Tap `完了報告へ進む`, then `完了報告を送信`.

## Notes

- No backend or real AI API is used.
- Camera access uses the browser `getUserMedia` API. It works on `localhost` and secure HTTPS origins.
- The room image is a generated demo asset at `public/demo-room.png`.
- UI styling follows `design.md`: warm eggshell canvas, taupe surfaces, black pill actions, hairline borders, and restrained color use.
# roomcheck
