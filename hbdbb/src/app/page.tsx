"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

// define confetti type
type Confetti = {
  left: string;
  top: string;
  animationDelay: string;
  width: string;
  height: string;
  className: string;
  key: number;
  color: string;
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const fullMessage =
    "My Dearest, Frances Ryza,\n\n I longed to personally greet you on your birthday, to hold you and to have your heart close to mine. But though fate and distance conspired against us, my heart never lets go of you. Today, I'd like you to smile the brightest, to laugh the loudest, and to feel the utmost happiness. I want you to know that for every quiet moment, every shared memory, every laugh we had, I cherish them all deeply. And so, I wish for you to carry all the love i have for you, wherever you go. \n Forever yours, \n\n -Dohn Michael";

  const [displayText, setDisplayText] = useState("");
  const [mwaList, setMwaList] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [confettiData, setConfettiData] = useState<Confetti[]>([]);

  // stable ID counter (avoids SSR mismatch from Date.now)
  const idRef = useRef(0);
  const nextId = () => ++idRef.current;

  const heartColors = [
    "#F472B6",
    "#60A5FA",
    "#FBBF24",
    "#34D399",
    "#A78BFA",
    "#FB7185",
  ];

  const handleHeartClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = nextId();

    const offsetX = Math.random() * 80 - 40;
    const offsetY = Math.random() * 80 - 40;

    const x = rect.width / 2 + offsetX;
    const y = rect.height / 2 + offsetY;

    setMwaList((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setMwaList((prev) => prev.filter((m) => m.id !== id));
    }, 1500);
  };

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    let timer: NodeJS.Timeout;
    if (open && displayText.length === 0) {
      timer = setInterval(() => {
        setDisplayText(fullMessage.slice(0, i + 1));
        i++;
        if (i >= fullMessage.length) clearInterval(timer);
      }, 50);
    }
    return () => clearInterval(timer);
  }, [open]);

  // Confetti (client-only)
  useEffect(() => {
    const confettiArr: Confetti[] = [...Array(24)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `-${20 + Math.random() * 40}%`,
      animationDelay: `${Math.random() * 2}s`,
      width: `${16 + Math.random() * 16}px`,
      height: `${16 + Math.random() * 16}px`,
      className: `confetti-heart confetti-heart-${i % 6} absolute transform-gpu`,
      key: i,
      color: heartColors[i % heartColors.length],
    }));
    setConfettiData(confettiArr);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-red-100 p-4 sm:p-6">
      <div className="flex flex-col items-center space-y-6 p-4 sm:p-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-rose-400">
          Happy Birthday, Baby!
        </h1>
        <p className="mt-2 text-rose-500 italic text-center">I love you!</p>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div
          role="button"
          onClick={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
          tabIndex={0}
          className="cursor-pointer w-full max-w-xl bg-white shadow-xl border rounded-lg overflow-hidden relative"
        >
          <div className="bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat p-4 sm:p-8 h-[24rem] sm:h-[28rem] overflow-y-auto whitespace-pre-wrap font-handwriting text-gray-800 leading-relaxed">
            {open ? displayText : "Click to open your paper card 💌"}
          </div>

          {/* Heart button and mwah container */}
          <div className="absolute bottom-6 right-10 flex flex-col items-center">
            <p className="text-sm text-gray-600">Click Me!</p>
            <button
              onClick={handleHeartClick}
              className="relative transition-transform transform hover:scale-125 active:scale-95"
            >
              <Heart className="w-8 h-8 text-rose-600 fill-rose-600" />

              {/* Floating Mwas */}
              {mwaList.map((m) => (
                <span
                  key={m.id}
                  style={{ left: m.x, top: m.y }}
                  className="absolute text-rose-600 font-bold animate-float pointer-events-none"
                >
                  Mwah!
                </span>
              ))}
            </button>
          </div>
        </div>
      </div>

      {/* Confetti hearts */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {confettiData.map((confetti) => (
          <span
            key={confetti.key}
            className={confetti.className}
            style={{
              left: confetti.left,
              top: confetti.top,
              animationDelay: confetti.animationDelay,
              width: confetti.width,
              height: confetti.height,
              display: "inline-block",
            }}
          >
            <svg
              width={confetti.width}
              height={confetti.height}
              viewBox="0 0 32 32"
              fill="none"
              style={{ display: "block" }}
            >
              <path
                d="M16 29s-13-8.35-13-16.5C3 6.57 8.57 3 13.5 7.5c2.5 2.25 2.5 2.25 5 0C23.43 3 29 6.57 29 12.5 29 20.65 16 29 16 29z"
                fill={confetti.color}
              />
            </svg>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 1;
          }
        }

        .confetti-heart {
          border-radius: 2px;
        }
        .confetti-heart-0 {
          animation: confetti-fall 3.8s linear infinite;
        }
        .confetti-heart-1 {
          animation: confetti-fall 4.2s linear infinite;
        }
        .confetti-heart-2 {
          animation: confetti-fall 3.4s linear infinite;
        }
        .confetti-heart-3 {
          animation: confetti-fall 4.6s linear infinite;
        }
        .confetti-heart-4 {
          animation: confetti-fall 5s linear infinite;
        }
        .confetti-heart-5 {
          animation: confetti-fall 3.2s linear infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(1.2);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
