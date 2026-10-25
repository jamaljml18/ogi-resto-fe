"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const WELCOME_HOLD_MS = 3500;
const WELCOME_EXIT_MS = 350;

export default function WelcomeIntro({ onComplete }) {
  const [phase, setPhase] = useState("hidden");
  const dialog = useRef(null),
    primary = useRef(null),
    completed = useRef(false);
  const visible = phase !== "hidden";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frame = requestAnimationFrame(() => {
      let pending = false;
      try {
        pending = Boolean(localStorage.getItem("ogi_waiting_payment"));
      } catch {}
      if (pending || motion.matches) {
        if (!completed.current) {
          completed.current = true;
          onComplete();
        }
        return;
      }
      setPhase("open");
    });
    const reduceMotion = () => {
      if (!motion.matches) return;
      setPhase("hidden");
      if (!completed.current) {
        completed.current = true;
        onComplete();
      }
    };
    motion.addEventListener("change", reduceMotion);
    return () => {
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", reduceMotion);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase === "hidden") return;
    const timer = setTimeout(
      () => {
        if (phase === "open") setPhase("leaving");
        else {
          setPhase("hidden");
          if (!completed.current) {
            completed.current = true;
            onComplete();
          }
        }
      },
      phase === "open" ? WELCOME_HOLD_MS : WELCOME_EXIT_MS,
    );
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  useEffect(() => {
    if (!visible) return;
    const page = document.querySelector(".app-wrapper");
    const previousInert = page?.inert,
      previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    if (page) page.inert = true;
    document.body.style.overflow = "hidden";
    primary.current?.focus({ preventScroll: true });
    return () => {
      if (page) page.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      if (previousFocus !== document.body && previousFocus?.isConnected)
        previousFocus.focus?.({ preventScroll: true });
    };
  }, [visible]);

  function dismiss() {
    if (phase === "open") setPhase("leaving");
  }
  function handleKeys(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    }
    if (event.key !== "Tab") return;
    const buttons = [...dialog.current.querySelectorAll("button")];
    const first = buttons[0],
      last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (!visible) return null;
  return createPortal(
    <section
      ref={dialog}
      className={
        "welcome-intro" + (phase === "leaving" ? " welcome-intro-leaving" : "")
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-intro-title"
      aria-describedby="welcome-intro-description"
      onKeyDown={handleKeys}
    >
      <div className="welcome-intro-grain" aria-hidden="true" />
      <header className="welcome-intro-topbar">
        <span className="welcome-intro-wordmark">
          OGI<span>RESTO</span>
        </span>
        <button type="button" className="welcome-intro-skip" onClick={dismiss}>
          Lewati
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M5 12h14m-5-5 5 5-5 5" />
          </svg>
        </button>
      </header>
      <div className="welcome-intro-content">
        <div className="welcome-intro-copy">
          <p className="welcome-intro-eyebrow">
            <span /> Selamat datang di
          </p>
          <h1 id="welcome-intro-title">
            Ogi <span>Resto.</span>
          </h1>
          <p className="welcome-intro-tagline">
            Rasa rumahan.
            <br />
            Momen yang istimewa.
          </p>
          <p id="welcome-intro-description">
            Menu pilihan untuk menemani
            <br className="welcome-intro-linebreak" /> jeda makan siang Anda.
          </p>
          <button
            ref={primary}
            type="button"
            className="welcome-intro-enter"
            onClick={dismiss}
          >
            Lihat Menu
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="welcome-intro-art" aria-hidden="true">
          <div className="welcome-intro-orbit" />
          <span className="welcome-intro-spark welcome-intro-spark-one">+</span>
          <span className="welcome-intro-spark welcome-intro-spark-two">+</span>
          <svg
            className="welcome-intro-plate"
            viewBox="0 0 400 400"
            fill="none"
          >
            <circle
              cx="200"
              cy="200"
              r="155"
              fill="#fffdf8"
              stroke="#e4d7c3"
              strokeWidth="1.5"
            />
            <circle
              cx="200"
              cy="200"
              r="137"
              stroke="#f0e7d8"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="200"
              r="111"
              fill="#faf4e8"
              stroke="#e9dcc5"
              strokeWidth="1"
            />
            <path
              d="M54 127v53m-10-53v31c0 13 20 13 20 0v-31m-10 53v92"
              stroke="#b18b54"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M347 127c-17 12-19 50-7 60h7m0-60v145"
              stroke="#b18b54"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="welcome-intro-steam welcome-intro-steam-one"
              d="M174 160c-14-15 13-23 0-39"
              stroke="#bc955d"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="welcome-intro-steam welcome-intro-steam-two"
              d="M201 152c-14-15 13-23 0-39"
              stroke="#bc955d"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="welcome-intro-steam welcome-intro-steam-three"
              d="M228 160c-14-15 13-23 0-39"
              stroke="#bc955d"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M134 194h132c-5 44-27 64-66 64s-61-20-66-64Z"
              fill="#872c42"
            />
            <ellipse cx="200" cy="194" rx="67" ry="10" fill="#a14b5e" />
            <ellipse cx="200" cy="192" rx="52" ry="5" fill="#f4ddbb" />
            <path
              d="M180 263h40"
              stroke="#872c42"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M154 292c20 12 72 12 92 0"
              stroke="#dfc8a4"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M286 91c21-13 30-11 30-11s0 22-25 27" fill="#719174" />
            <path d="M302 112c21-2 29 5 29 5s-12 17-35 9" fill="#95aa86" />
            <path
              d="m286 125 23-39"
              stroke="#536e54"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="welcome-intro-seal">
            <span className="welcome-intro-seal-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </span>
            <span>
              Dibuat dengan
              <br />
              <strong>sepenuh hati.</strong>
            </span>
          </div>
        </div>
      </div>
      <footer className="welcome-intro-footer">
        <span /> Katering harian, selalu dekat di hati <span />
      </footer>
    </section>,
    document.body,
  );
}
