# RoomCheck

A mobile web demo for a hotel checkout assistant — built for a business contest pitch. It's in Japanese, runs entirely in the browser, and the AI is mocked (no backend, no real API). Just a clean UI to sell the idea.

## Get started

```bash
npm install
npm run dev
```

Open whatever URL Vite spits out, probably `http://localhost:5173/`.

## How it works

1. Grant camera access.
2. Tap `撮影してAI確認` to start.
3. Wait a sec while the fake AI does its thing.
4. Tap any checklist item to see the actual hotel cleaning manual steps.
5. Tap `完了写真を撮る` to snap a completion photo for that task.
6. It runs another fake AI check to confirm.
7. If you're presenting and wanna speed things up, hit `デモ用に一括確認`.
8. Tap `完了報告へ進む`, then `完了報告を送信` to finish.

## Notes

- No backend. No AI. It's all fake, just enough to make the pitch work.
- Camera uses `getUserMedia` — works on `localhost` or HTTPS.
- Demo room photo is at `public/demo-room.png`.
- Design details in `design.md` if you're curious.
