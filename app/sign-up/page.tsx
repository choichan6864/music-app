"use client";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function SignUp() {
  const searchParams = useSearchParams();
  const [information, setInformation] = useState<{
    id: string;
    passwd: string;
    checkedPasswd: string;
  }>({
    id: "",
    passwd: "",
    checkedPasswd: "",
  });
  const toBool = (str: any) => str === "false";
  const err = {
    id: toBool(searchParams.get("id")),
    passwd: toBool(searchParams.get("passwd")),
    rechecking: toBool(searchParams.get("rechecking")),
  };
  const { id, passwd, checkedPasswd } = information;
  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setInformation({
      id: e.target.value,
      passwd,
      checkedPasswd,
    });
  };
  const onChangePasswd = (e: ChangeEvent<HTMLInputElement>) => {
    setInformation({
      id,
      passwd: e.target.value,
      checkedPasswd,
    });
  };
  const onChangeCheckedPasswd = (e: ChangeEvent<HTMLInputElement>) => {
    setInformation({
      id,
      passwd,
      checkedPasswd: e.target.value,
    });
  };

  return (
    <form method="post" action="/api/user/sign-up">
      <input name="id" type="text" onChange={onChangeId} value={id}></input>
      <div>{err.id ? "아이디가 존재합니다" : null}</div>
      <input
        name="passwd"
        type="password"
        onChange={onChangePasswd}
        value={passwd}
      ></input>
      <div>
        {err.passwd
          ? "비밀번호가 8~20자여야합니다."
          : err.rechecking
          ? "비밀번호가 같지않습니다."
          : null}
      </div>
      <input
        name="checkedPasswd"
        type="password"
        onChange={onChangeCheckedPasswd}
        value={checkedPasswd}
      ></input>
      <input type="submit" />
    </form>
  );
}
