"use client";

import React, { useRef, useState } from "react";
import Input from "../otherComponent/input";
import { Button } from "../otherComponent/button";
import useCreateRoom from "../hook/useCreateRoom";
import { useRouter } from "next/navigation";

interface MyDataType {
  message: string;
  roomId: string;
}

function page() {
  const router = useRouter();
  const [room, setRoom] = useState<string | null>();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-black h-screen w-full">
      <div className="flex flex-col">
        <Input
          type="text"
          placeholder="room name"
          onChange={() => {
            setRoom(inputRef.current?.value);
          }}
          name="createroom"
          ref={inputRef}
        />

        <Button
          onClick={async () => {
            if (typeof room !== "string") {
              return;
            }
            const response = await useCreateRoom(room);

            const data = response.data as MyDataType;
            if (response.status === 200) {
              router.push(`/canvas/${data.roomId}`);
            }
          }}
          children="create"
          className="h-12 w-[160px] mx-auto rounded-md bg-gradient-to-tr from-[#87CEFA]  to-[#4169E1] text-white mt-8 text-xl"
        />
      </div>
    </div>
  );
}

export default page;
