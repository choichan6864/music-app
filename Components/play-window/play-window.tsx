"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../play-window.module.css";
import Image from "next/image";
import { PlayBar, bar } from "./play-bar";
import { Provider, useSelector } from "react-redux";
import { store } from "@/store/store";

function MusicFuction({ music }: { music: any }) {
  const [audio, setAudio] = useState<HTMLAudioElement>(new Audio());
  const [controlPanel, setControlPanel] = useState({
    play: false,
  });

  const ref = useRef<HTMLButtonElement>(null);

  const events = {
    keydown: (e: any) => {
      if (e.key === 32 || e.key === " " || e.key === "SpaceBar") {
        ref.current?.click();
      }
    },
    ended: () => setControlPanel({ play: false }),
    loadedmetadata: () => {
      audio.play();

      bar.duration = audio.duration;
      audio.addEventListener("ended", events.ended);
    },
    onClick: () => {
      (bar.playing = !controlPanel.play),
        bar.playing ? audio.play() : audio.pause();
      setControlPanel({
        play: bar.playing,
      });
    },
  };
  const { ended, loadedmetadata, onClick, keydown } = events;

  function defaultSetting() {
    bar.playing = true;
    window.addEventListener("keydown", keydown);
    audio.addEventListener("loadedmetadata", loadedmetadata);
  }

  useEffect(() => {
    defaultSetting();
    return () => {
      window.removeEventListener("keydown", keydown);
      audio.removeEventListener("loadedmetadata", loadedmetadata);
      audio.removeEventListener("ended", ended);
    };
  }, []);
  useEffect(() => {
    audio.src = `/uploads/album:${music.album}_${music.file}`;
    setAudio(audio);
    setControlPanel({ play: true });
    bar.playing = true;
  }, [music]);

  return (
    <footer className={styles.footer}>
      <button onClick={onClick} ref={ref}>
        <Image
          height={40}
          width={40}
          src={controlPanel.play ? "/pause-button.svg" : "/play-button.svg"}
          alt=""
        ></Image>
      </button>
      <PlayBar audio={audio} />
    </footer>
  );
}

function MusicSlice() {
  const music = useSelector(
    (state: { music: { name: string; album: string; file: string } }) =>
      state.music
  );
  return music.name !== "" ? <MusicFuction music={music} /> : <></>;
}

export default function PlayWindow() {
  return (
    <Provider store={store}>
      <MusicSlice />
    </Provider>
  );
}
