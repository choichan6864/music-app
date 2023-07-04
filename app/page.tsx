"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { slice, store } from "@/store/store";
import { Provider, useDispatch, useSelector } from "react-redux";

function MusicElement() {
  const [music, setMusic] = useState([]);
  const dispatch = useDispatch<any>();
  useEffect(() => {
    (async () => {
      const { data } = await axios("/api/get/music");
      setMusic(data);
      console.log(data);
    })();
  }, []);
  return (
    <div>
      {music.map(
        (data: { albumName: string; fileName: string; songName: string }) => {
          const onClick = () => {
            dispatch(
              slice.actions.playMusic({
                name: data.songName,
                album: data.albumName,
                file: data.fileName,
              })
            );
          };
          return (
            <div className={styles.musicContrainer}>
              <div className={styles.musicImg} onClick={onClick}>
                <Image
                  width={50}
                  height={50}
                  alt=""
                  src={`/uploads/${data.albumName}.png`}
                />
              </div>
              <div className={styles.backOfImg}>
                <div className={styles.playIcon}></div>
              </div>
              <div>{data.songName}</div>
            </div>
          );
        }
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Provider store={store}>
        <MusicElement />
      </Provider>
    </main>
  );
}
