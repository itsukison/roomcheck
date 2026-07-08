import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Scan,
  ClipboardCheck,
  Image,
  RotateCcw,
  Send,
} from "lucide-react";
import "./styles.css";

const manualItems = [
  {
    id: "bed",
    title: "ベッド周りの整頓",
    area: "寝室",
    confidence: 94,
    estimate: "約1分",
    quote: "掛け布団の端が乱れています",
    steps: [
      "掛け布団をベッドの中心に合わせて、足元側へ軽く伸ばします。",
      "枕はヘッドボード側にそろえ、表面の大きなしわを手で整えます。",
      "忘れ物がないか、枕元とベッド下を確認してください。",
    ],
  },
  {
    id: "towels",
    title: "使用済みタオルの回収",
    area: "浴室",
    confidence: 91,
    estimate: "約1分",
    quote: "浴室前に使用済みタオルを検出",
    steps: [
      "濡れたタオルは床に置かず、浴室ドア横の回収バッグへ入れます。",
      "未使用タオルは棚の右側に重ね、使用済みと混ざらないようにします。",
      "バスマットは浴室内のフックに掛けてください。",
    ],
  },
  {
    id: "trash",
    title: "ゴミの分別",
    area: "入口",
    confidence: 88,
    estimate: "約2分",
    quote: "可燃・ペットボトルの混在を検出",
    steps: [
      "紙くず・包装は可燃ごみ袋へ入れます。",
      "ペットボトルは中身を空にし、キャップを外して資源ごみ側へ入れます。",
      "缶・びんがある場合は、デスク下の小袋へ分けてください。",
    ],
  },
  {
    id: "sink",
    title: "洗面台の水滴ふき取り",
    area: "洗面",
    confidence: 96,
    estimate: "約1分",
    quote: "蛇口周辺に水滴があります",
    steps: [
      "備え付けのペーパーまたは未使用のティッシュで水滴を軽く拭き取ります。",
      "鏡に水はねがある場合は、上から下へ一方向に拭いてください。",
      "排水口まわりに髪の毛が残っていないか確認します。",
    ],
  },
  {
    id: "amenity",
    title: "アメニティの配置確認",
    area: "デスク",
    confidence: 83,
    estimate: "約1分",
    quote: "歯ブラシとコームの位置がずれています",
    steps: [
      "未使用アメニティをトレー内に戻します。",
      "歯ブラシ、コーム、綿棒を左から順にそろえてください。",
      "開封済みのものは回収バッグへ入れます。",
    ],
  },
  {
    id: "floor",
    title: "床の小さな汚れ",
    area: "通路",
    confidence: 79,
    estimate: "約1分",
    quote: "入口付近に小さな汚れの可能性",
    steps: [
      "汚れの場所を確認し、濡らしたティッシュで軽く拭きます。",
      "落ちない場合は無理にこすらず、フロント連絡対象として残してください。",
      "拭き取り後、照明をつけた状態で写真を撮影してください。",
    ],
  },
];

const initialStatus = Object.fromEntries(manualItems.map((item) => [item.id, "todo"]));

function App() {
  const [screen, setScreen] = useState("capture");
  const [expanded, setExpanded] = useState("bed");
  const [statuses, setStatuses] = useState(initialStatus);
  const [retryId, setRetryId] = useState(null);
  const [demoCompleting, setDemoCompleting] = useState(false);
  const [roomPhoto, setRoomPhoto] = useState("/demo-room.png");
  const [activeCaptureId, setActiveCaptureId] = useState(null);
  const [confirmationPhoto, setConfirmationPhoto] = useState(null);

  const completedCount = useMemo(
    () => Object.values(statuses).filter((status) => status === "done").length,
    [statuses],
  );

  const startScan = (photo) => {
    if (photo) {
      setRoomPhoto(photo);
    }
    setScreen("scan");
    window.setTimeout(() => setScreen("checklist"), 1900);
  };

  const openTaskCamera = (id) => {
    setActiveCaptureId(id);
    setConfirmationPhoto(null);
    setScreen("taskCamera");
  };

  const confirmTaskPhoto = (photo) => {
    setConfirmationPhoto(photo || "/demo-room.png");
    setStatuses((current) => ({ ...current, [activeCaptureId]: "checking" }));
    setScreen("taskConfirm");
  };

  const resolveTaskConfirmation = () => {
    if (activeCaptureId === "floor" && retryId !== activeCaptureId) {
      setRetryId(activeCaptureId);
      setStatuses((current) => ({ ...current, [activeCaptureId]: "retry" }));
    } else {
      setStatuses((current) => ({ ...current, [activeCaptureId]: "done" }));
    }
    setExpanded(activeCaptureId);
    setActiveCaptureId(null);
    setConfirmationPhoto(null);
    setScreen("checklist");
  };

  const completeDemo = () => {
    setDemoCompleting(true);
    setStatuses(Object.fromEntries(manualItems.map((item) => [item.id, "checking"])));
    window.setTimeout(() => {
      setStatuses(Object.fromEntries(manualItems.map((item) => [item.id, "done"])));
      setDemoCompleting(false);
      setExpanded("floor");
    }, 1200);
  };

  const resetDemo = () => {
    setScreen("capture");
    setExpanded("bed");
    setStatuses(initialStatus);
    setRetryId(null);
    setDemoCompleting(false);
    setRoomPhoto("/demo-room.png");
    setActiveCaptureId(null);
    setConfirmationPhoto(null);
  };

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="RoomCheck AI demo">
        <TopBar screen={screen} completedCount={completedCount} />

        {screen === "capture" && <CaptureScreen onScan={startScan} roomPhoto={roomPhoto} />}
        {screen === "scan" && <ScanScreen photo={roomPhoto} />}
        {screen === "checklist" && (
          <ChecklistScreen
            completedCount={completedCount}
            expanded={expanded}
            setExpanded={setExpanded}
            statuses={statuses}
            demoCompleting={demoCompleting}
            onVerify={openTaskCamera}
            onDemoComplete={completeDemo}
            onFinish={() => setScreen("complete")}
          />
        )}
        {screen === "taskCamera" && (
          <TaskCameraScreen
            item={manualItems.find((item) => item.id === activeCaptureId)}
            onCancel={() => setScreen("checklist")}
            onCapture={confirmTaskPhoto}
          />
        )}
        {screen === "taskConfirm" && (
          <TaskConfirmScreen
            item={manualItems.find((item) => item.id === activeCaptureId)}
            photo={confirmationPhoto}
            willRetry={activeCaptureId === "floor" && retryId !== activeCaptureId}
            onDone={resolveTaskConfirmation}
          />
        )}
        {screen === "complete" && <CompleteScreen onReset={resetDemo} />}
      </section>
    </main>
  );
}

function TopBar({ screen, completedCount }) {
  return (
    <header className="topbar">
      <div>
        <p className="brand">RoomCheck AI</p>
        <p className="microcopy">ゲスト向け客室チェック</p>
      </div>
      <div className="progress-pill">
        <CircleDot size={14} />
        {screen === "capture" ? "撮影" : `${completedCount}/6`}
      </div>
    </header>
  );
}

function CaptureScreen({ onScan, roomPhoto }) {
  return (
    <div className="screen capture-screen">
      <div className="headline-block">
        <p className="eyebrow">Checkout assist</p>
        <h1>お部屋を撮影してください</h1>
        <p>
          AIが写真とホテルの清掃マニュアルを照合し、必要な作業だけをチェックリストにします。
        </p>
      </div>

      <CameraCapture
        fallbackImage={roomPhoto}
        instruction="客室全体が入るように撮影"
        primaryLabel="撮影してAI確認"
        onCapture={onScan}
      />
    </div>
  );
}

function CameraCapture({ fallbackImage, instruction, primaryLabel, onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraState, setCameraState] = useState("loading");
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    let mounted = true;
    let activeStream = null;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState("unsupported");
        return;
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        activeStream = mediaStream;
        if (!mounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        setStream(mediaStream);
        setCameraState("ready");
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch {
        if (mounted) {
          setCameraState("blocked");
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const takePhoto = () => {
    if (
      cameraState !== "ready" ||
      !videoRef.current ||
      !canvasRef.current ||
      videoRef.current.readyState < 2
    ) {
      const fallback = capturedPhoto || fallbackImage;
      setCapturedPhoto(fallback);
      onCapture(fallback);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    try {
      canvas.width = video.videoWidth || 1080;
      canvas.height = video.videoHeight || 1920;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL("image/jpeg", 0.88);
      setCapturedPhoto(photo);
      onCapture(photo);
    } catch {
      const fallback = capturedPhoto || fallbackImage;
      setCapturedPhoto(fallback);
      onCapture(fallback);
    }
  };

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photo = reader.result;
      setCapturedPhoto(photo);
      onCapture(photo);
    };
    reader.readAsDataURL(file);
  };

  const previewImage = capturedPhoto || fallbackImage;
  const showVideo = cameraState === "ready" && !capturedPhoto;

  return (
    <div className="camera-flow">
      <div className="camera-card live-camera">
        {showVideo ? (
          <video ref={videoRef} autoPlay playsInline muted aria-label="カメラプレビュー" />
        ) : (
          <img src={previewImage} alt="撮影プレビュー" />
        )}
        <div className="camera-overlay">
          <span>
            {cameraState === "loading"
              ? "カメラを起動しています"
              : cameraState === "blocked"
                ? "カメラ許可がないためデモ写真を使用"
                : cameraState === "unsupported"
                  ? "この環境では写真選択を使用"
                  : instruction}
          </span>
        </div>
        <div className="focus-corners" aria-hidden="true" />
      </div>

      <canvas ref={canvasRef} className="capture-canvas" aria-hidden="true" />
      <input ref={fileRef} className="file-input" type="file" accept="image/*" capture="environment" onChange={choosePhoto} />

      <div className="action-row">
        <button className="primary-button" onClick={takePhoto}>
          <Camera size={18} />
          {primaryLabel}
        </button>
        <button className="secondary-button" onClick={() => fileRef.current?.click()}>
          <Image size={18} />
          写真を選択
        </button>
      </div>

      {onCancel && (
        <button className="secondary-button full-width" onClick={onCancel}>
          チェックリストへ戻る
        </button>
      )}
    </div>
  );
}

function ScanScreen({ photo }) {
  return (
    <div className="screen scan-screen">
      <div className="photo-scan-card">
        <img src={photo} alt="AI解析中の客室写真" />
        <div className="scan-line" />
      </div>
      <div className="headline-block centered">
        <p className="eyebrow">Mock AI analysis</p>
        <h1>マニュアルと照合しています</h1>
        <p>客室写真から状態を読み取り、日本式ホテル基準の手順を生成中です。</p>
      </div>
      <div className="analysis-list">
        <span>客室タイプを推定</span>
        <span>汚れ・配置ずれを検出</span>
        <span>該当マニュアルを抽出</span>
      </div>
    </div>
  );
}

function ChecklistScreen({
  completedCount,
  expanded,
  setExpanded,
  statuses,
  demoCompleting,
  onVerify,
  onDemoComplete,
  onFinish,
}) {
  const ready = completedCount === manualItems.length;

  return (
    <div className="screen checklist-screen">
      <div className="summary-panel">
        <div>
          <p className="eyebrow">AI generated checklist</p>
          <h1>確認が必要な項目</h1>
        </div>
        <div className="summary-grid">
          <Metric label="検出" value="6件" />
          <Metric label="目安" value="約7分" />
          <Metric label="完了" value={`${completedCount}/6`} />
        </div>
        <button className="secondary-button demo-button" disabled={demoCompleting || ready} onClick={onDemoComplete}>
          <Scan size={17} />
          {demoCompleting ? "AI一括確認中" : "デモ用に一括確認"}
        </button>
      </div>

      <div className="task-list">
        {manualItems.map((item) => (
          <TaskCard
            key={item.id}
            item={item}
            expanded={expanded === item.id}
            status={statuses[item.id]}
            onToggle={() => setExpanded(expanded === item.id ? "" : item.id)}
            onVerify={() => onVerify(item.id)}
          />
        ))}
      </div>

      <button className="primary-button sticky-action" disabled={!ready} onClick={onFinish}>
        <Send size={18} />
        完了報告へ進む
      </button>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TaskCard({ item, expanded, status, onToggle, onVerify }) {
  const statusLabel = {
    todo: "未完了",
    checking: "確認中",
    retry: "要修正",
    done: "完了",
  }[status];

  return (
    <article className={`task-card status-${status}`}>
      <button className="task-head" onClick={onToggle} aria-expanded={expanded}>
        <div className="status-mark">
          {status === "done" ? <Check size={16} /> : <Scan size={16} />}
        </div>
        <div>
          <p className="task-meta">
            {item.area} ・ AI検出 {item.confidence}% ・ {item.estimate}
          </p>
          <h2>{item.title}</h2>
          <p className="quote">「{item.quote}」</p>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {expanded && (
        <div className="manual-detail">
          <div className="manual-label">
            <ClipboardCheck size={15} />
            ホテル清掃マニュアル
          </div>
          <ol>
            {item.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          {status === "retry" && (
            <div className="retry-note">
              AI確認: 入口付近の影で汚れが残って見えます。照明をつけてもう一度撮影してください。
            </div>
          )}

          <div className="manual-actions">
            <span>{statusLabel}</span>
            <button className="secondary-button compact" disabled={status === "checking" || status === "done"} onClick={onVerify}>
              {status === "checking" ? <Scan size={16} /> : status === "retry" ? <RotateCcw size={16} /> : <Camera size={16} />}
              {status === "checking" ? "AI確認中" : status === "retry" ? "再撮影する" : "完了写真を撮る"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function TaskCameraScreen({ item, onCancel, onCapture }) {
  return (
    <div className="screen capture-screen">
      <div className="headline-block">
        <p className="eyebrow">Completion photo</p>
        <h1>{item?.title || "完了写真を撮影"}</h1>
        <p>作業後の状態を撮影してください。AIがホテルのマニュアル基準と照合します。</p>
      </div>

      <CameraCapture
        fallbackImage="/demo-room.png"
        instruction="作業が完了した場所を中央に入れて撮影"
        primaryLabel="完了写真を撮る"
        onCapture={onCapture}
        onCancel={onCancel}
      />
    </div>
  );
}

function TaskConfirmScreen({ item, photo, willRetry, onDone }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1800);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="screen scan-screen">
      <div className="photo-scan-card">
        <img src={photo || "/demo-room.png"} alt="AI確認中の完了写真" />
        <div className="scan-line" />
      </div>
      <div className="headline-block centered">
        <p className="eyebrow">Mock AI confirmation</p>
        <h1>{willRetry ? "もう少しだけ確認しています" : "完了写真を確認しています"}</h1>
        <p>
          {item?.title || "作業項目"}をマニュアル基準と照合中です。写真の状態、配置、汚れ残りを確認しています。
        </p>
      </div>
      <div className="analysis-list">
        <span>撮影範囲を確認</span>
        <span>作業前写真との差分を検出</span>
        <span>{willRetry ? "修正候補を生成" : "完了条件を照合"}</span>
      </div>
    </div>
  );
}

function CompleteScreen({ onReset }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="screen complete-screen">
      <div className="complete-mark">
        <Check size={34} />
      </div>
      <div className="headline-block centered">
        <p className="eyebrow">Ready to checkout</p>
        <h1>お部屋の確認が完了しました</h1>
        <p>6件すべての作業がAIで確認されました。フロントへ完了報告を送信できます。</p>
      </div>

      <div className="final-card">
        <Metric label="完了項目" value="6/6" />
        <Metric label="AI確認" value="済み" />
        <Metric label="所要時間" value="6分42秒" />
      </div>

      <button className="primary-button" onClick={() => setSent(true)}>
        {sent ? <Check size={18} /> : <Send size={18} />}
        {sent ? "フロントへ送信済み" : "完了報告を送信"}
      </button>
      <button className="secondary-button" onClick={onReset}>
        <RotateCcw size={18} />
        デモを最初から
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
