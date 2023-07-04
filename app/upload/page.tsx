"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";

function AlbumList({ onChange }: { onChange: (e: any) => void }) {
  return (
    <div className={styles.albumInputs}>
      <input placeholder="Album name" name="albumName"></input>
      <div className={styles.findImg}>
        <label htmlFor="img">Find Album Img</label>
      </div>
      <input
        type="file"
        onChange={onChange}
        accept="image/*"
        id="img"
        className={styles.hidden}
        name="img"
      ></input>
    </div>
  );
}

function Music() {
  const [music, setMusic] = useState<string>("");
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setMusic(e.target.value);
  };
  return (
    <li>
      <input type="text" onChange={onChangeName} value={music} name="musicName" />
      <input
        accept="audio/*"
        type="file"
        name="musicFile"
      ></input>
    </li>
  );
}

function MusicList() {
  const [list, setList] = useState<number[]>([]);
  const onClick = () => {
    setList([...list, list.length]);
  };
  return (
    <ul className={styles.ul}>
      <li>
        <button type="button" className={styles.addBtn} onClick={onClick}>
          +
        </button>
      </li>
      {list.map((i: number) => {
        return <Music />
      })}
    </ul>
  );
}

export default function Upload() {
  const [imgSrc, setImgSrc] = useState("");
  const onChange = (e: any) => {
    console.log(e);
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        console.log(e.target.result);
        setImgSrc(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <main className={styles.main}>
      <div className={styles.imgContainer}>
        {imgSrc !== "" ? (
          <Image fill src={imgSrc} alt="" className={styles.img}></Image>
        ) : (
          "please put image"
        )}
      </div>
      <form
        method="post"
        action="/api/upload"
        encType="multipart/form-data"
        className={styles.form}
      >
        <AlbumList onChange={onChange} />
        <MusicList />
        <input type="submit" />
      </form>
    </main>
  );
}
