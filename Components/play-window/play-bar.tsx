"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../play-window.module.css";

const bar = {
  hold: false,
  maxWidth: 0,
  x: 0,
  playing: false,
  duration: 0,
  left: 6,
  time: 0,
  roundWidth: 6,
};

function PlayBar({ audio }: { audio: any }) {
  const [left, setLeft] = useState<number>(bar.roundWidth);
  const [playTime, setPlayTime] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  const onMouseDown = () => (bar.hold = true);
  useEffect(() => {
    audio.addEventListener("timeupdate", () => {
      bar.time = audio.currentTime;
      bar.left = bar.roundWidth + bar.maxWidth * (bar.time / bar.duration);
      setPlayTime(bar.time);

      if (bar.duration === bar.time) bar.playing = false;
      setLeft(bar.left);
    });
    const rect: any = ref.current?.getBoundingClientRect();
    bar.x = rect.x;
    bar.maxWidth = rect?.width;

    const onMouseMove = (e: any) => {
      if (
        bar.hold &&
        e.clientX >= bar.x - bar.roundWidth &&
        e.clientX <= bar.maxWidth + bar.x
      ) {
        bar.left =
          e.clientX - bar.x + bar.roundWidth < bar.roundWidth
            ? bar.roundWidth
            : e.clientX - bar.x + bar.roundWidth;
        setLeft(bar.left);

        audio.currentTime =
          ((bar.left - bar.roundWidth) * bar.duration) / bar.maxWidth;
        bar.time = audio.currentTime;
      }
    };

    const onMouseUp = (e: any) => (bar.hold = false);
    const resize = (e: any) => (bar.maxWidth = window.innerWidth);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className={styles.playBarCase}>
      <div
        className={styles.round}
        onTouchStart={onMouseDown}
        onMouseDown={onMouseDown}
        style={{ left }}
      ></div>
      <div className={styles.playBar} ref={ref}></div>
      <div style={{ color: "white" }}>
        {Math.floor(playTime / 60)}:
        {Math.floor(playTime % 60)
          .toString()
          .padStart(2, "0")}
      </div>
    </div>
  );
}

export { bar, PlayBar };
