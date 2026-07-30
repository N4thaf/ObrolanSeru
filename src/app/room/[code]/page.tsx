"use client";

import { useEffect, useState, useRef, use, Suspense } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Spinner from "@/components/Spinner";
import { Send, LogOut, Copy, Check } from "lucide-react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  avatarIndex: number;
}

interface RoomState {
  hostId: string;
  players: Player[];
  currentTurnIndex: number;
  questions: any[];
  currentQuestionIndex: number;
  status: "waiting" | "playing" | "finished";
  mode?: string;
  spinPhase?: boolean;
}

function RoomContent({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hostParam = searchParams.get("host");
  const nameParam = searchParams.get("name") || (hostParam ? "Host" : "Guest");
  const modeParam = searchParams.get("mode") || "pertanyaan";

  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [chat, setChat] = useState<{ userName: string; message: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [spinTarget, setSpinTarget] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_room", {
        roomCode,
        userName: nameParam,
        userId: hostParam ? "host_user_id" : null,
        mode: modeParam,
      });
    });

    newSocket.on("room_state", (state: RoomState) => {
      setRoom(state);
      if (state.status === "playing" && !state.spinPhase) {
        setIsFlipped(false);
        setCurrentQuestion(null);
      }
      if (!state.spinPhase) {
        setIsSpinning(false);
        setSpinTarget(null);
      }
    });

    newSocket.on("wheel_spinning", ({ targetIndex }: { targetIndex: number }) => {
      setSpinTarget(targetIndex);
      setIsSpinning(true);
    });

    newSocket.on("card_drawn", ({ question }: { question: any }) => {
      setCurrentQuestion(question);
      setIsFlipped(true);
    });

    newSocket.on("chat_message", (msg: any) => {
      setChat(prev => [...prev, msg]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    newSocket.on("error", (err: any) => {
      if (err.message === "Room not found") {
        alert("Room tidak ditemukan!");
        router.push("/");
      }
    });

    return () => { newSocket.disconnect(); };
  }, [roomCode, nameParam, hostParam, modeParam, router]);

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FFE2AF] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-sm font-medium">Menghubungkan ke room {roomCode}...</p>
        </div>
      </div>
    );
  }

  const isMyTurn = socket && room.players[room.currentTurnIndex]?.id === socket.id;
  const isHost = socket && room.players.find(p => p.id === socket.id)?.isHost;

  const handleStartGame = () => socket?.emit("start_game", { roomCode });
  const handleSpinWheel = () => { if (isMyTurn && room.spinPhase) socket?.emit("spin_wheel", { roomCode }); };
  const handleDrawCard = () => { if (isMyTurn && !room.spinPhase) socket?.emit("draw_card", { roomCode }); };
  const handleNextTurn = () => socket?.emit("next_turn", { roomCode });
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    const myName = room.players.find(p => p.id === socket.id)?.name || nameParam;
    socket.emit("chat_message", { roomCode, message: chatInput, userName: myName });
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-[#FFE2AF] font-sans flex flex-col md:flex-row">

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-bold text-slate-800 font-mono tracking-wider">{roomCode}</span>
            <button onClick={copyCode} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{room.players.length} pemain</span>
            <span>·</span>
            <span className="capitalize">{room.mode === 'tod' ? 'Truth or Dare' : 'Pertanyaan Seru'}</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-500 transition"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </header>

        {/* Game Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">

          {/* WAITING */}
          {room.status === "waiting" && (
            <div className="w-full max-w-sm space-y-6">
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kode Room</div>
                <div
                  className="text-5xl font-black tracking-[0.2em] text-blue-500 font-mono cursor-pointer hover:opacity-80 transition"
                  onClick={copyCode}
                >
                  {roomCode}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {copied ? '✓ Disalin!' : 'Ketuk untuk salin'}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Pemain Bergabung</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    {room.players.length}
                  </span>
                </div>
                {room.players.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
                      {p.name[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{p.name}</span>
                    <div className="ml-auto flex gap-1">
                      {p.id === socket?.id && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">KAMU</span>
                      )}
                      {p.isHost && (
                        <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">HOST</span>
                      )}
                    </div>
                  </div>
                ))}
                {room.players.length < 2 && (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-400">Menunggu pemain lain...</p>
                  </div>
                )}
              </div>

              {isHost ? (
                <button
                  onClick={handleStartGame}
                  className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 active:scale-95 transition"
                >
                  Mulai Permainan 🚀
                </button>
              ) : (
                <div className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-center text-sm">
                  Menunggu host memulai...
                </div>
              )}
            </div>
          )}

          {/* PLAYING */}
          {room.status === "playing" && (
            <div className="w-full flex flex-col items-center gap-6">

              {/* Turn indicator */}
              <div className="flex flex-wrap gap-2 justify-center">
                {room.players.map((p, i) => (
                  <span
                    key={p.id}
                    className={`text-sm px-3 py-1.5 rounded-full font-semibold transition ${
                      i === room.currentTurnIndex
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {p.name}
                  </span>
                ))}
              </div>

              {/* Spinner Phase */}
              {room.spinPhase ? (
                <Spinner
                  players={room.players}
                  spinning={isSpinning}
                  targetIndex={spinTarget}
                  onSpin={handleSpinWheel}
                  disabled={!isMyTurn}
                />
              ) : (
                <>
                  <Card
                    question={currentQuestion?.content || ""}
                    type={currentQuestion?.type || "normal"}
                    isFlipped={isFlipped}
                    onDraw={handleDrawCard}
                    disabled={!isMyTurn}
                  />

                  <div className="h-14 flex items-center justify-center">
                    {!isFlipped ? (
                      isMyTurn ? (
                        <p className="text-blue-500 font-semibold text-sm bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 animate-pulse">
                          Ketuk kartu untuk menarik!
                        </p>
                      ) : (
                        <p className="text-slate-400 text-sm">
                          Menunggu <strong>{room.players[room.currentTurnIndex]?.name}</strong> menarik kartu...
                        </p>
                      )
                    ) : isMyTurn ? (
                      <button
                        onClick={handleNextTurn}
                        className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 active:scale-95 transition"
                      >
                        Akhiri Giliran →
                      </button>
                    ) : (
                      <p className="text-slate-400 text-sm">
                        Menunggu <strong>{room.players[room.currentTurnIndex]?.name}</strong> selesai...
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* FINISHED */}
          {room.status === "finished" && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-black text-slate-800">Game Selesai!</h2>
              <p className="text-slate-500">Semua kartu sudah habis dimainkan.</p>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-100 bg-white flex flex-col max-h-64 md:max-h-screen">

        {/* Players mini bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex gap-2 overflow-x-auto">
          {room.players.map((p, i) => (
            <span
              key={p.id}
              className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                i === room.currentTurnIndex && room.status === "playing"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {p.name}
            </span>
          ))}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chat.length === 0 && (
            <p className="text-xs text-slate-400 text-center mt-4">Belum ada pesan. Say hi! 👋</p>
          )}
          {chat.map((msg, i) => {
            const isMe = msg.userName === (room.players.find(p => p.id === socket?.id)?.name || nameParam);
            const isSystem = msg.userName === "System";
            if (isSystem) return <div key={i} className="text-center text-xs text-slate-400">{msg.message}</div>;
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.userName}</span>
                <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-700 rounded-tl-sm'}`}>
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFE2AF] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RoomContent roomCode={unwrappedParams.code} />
    </Suspense>
  );
}
