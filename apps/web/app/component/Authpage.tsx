"use client";
import React, { useRef, useState } from "react";
import Input from "../otherComponent/input";
import Label from "../otherComponent/label";
import { Button } from "../otherComponent/button";
import Link from "next/link";
import useSignup from "../hook/useSignup";
import { useRouter } from "next/navigation";
import useLogin from "../hook/useLogin";

function Authpage({ isSignup }: { isSignup: boolean }) {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState<any>(null);
  const [password, setPassword] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);

  const [result, setresult] = useState(null);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="md:w-[420px] h-auto pb-10 bg-zinc-900 rounded-xl w-[360px]">
        <div className="h-[20%] mt-6">
          <h1 className="text-[28px] md:text-[34px] text-center font-bold text-white">
            Welcome to{" "}
            <span className="bg-gradient-to-tr from-[#0575E6] via-[#6DD5FA] to-[#021B79] text-transparent bg-clip-text inline-block">
              Excalidraw
            </span>
          </h1>
          <p className="font-medium text-neutral-500 text-lg text-center mt-2">
            Login to draw & share your drawing
          </p>
        </div>

        <div className="h-[80%] w-[100%]  flex flex-col justify-center items-center mt-6">
          <div className="h-full w-[90%] px-2 flex flex-col gap-2">
            <Label name="username" children="Username" />
            <Input
              ref={usernameRef}
              type="text"
              placeholder="username"
              onChange={() => {
                setUsername(usernameRef.current?.value);
              }}
              name="username"
            />

            {isSignup ? (
              <>
                <Label name="email" children="Email" />
                <Input
                  ref={emailRef}
                  type="email"
                  placeholder="email"
                  onChange={() => {
                    setEmail(emailRef.current?.value);
                  }}
                  name="email"
                />{" "}
              </>
            ) : (
              ""
            )}

            <Label name="password" children="password" />
            <Input
              ref={passwordRef}
              type="password"
              placeholder="password"
              onChange={() => {
                setPassword(passwordRef.current?.value);
              }}
              name="password"
            />

            <Button
              onClick={async () => {
                {
                  isSignup
                    ? await useSignup(username, password, email).then(
                        (response) => {
                          if (response.status === 200) {
                            router.push("/createroom");
                          }
                        }
                      )
                    : await useLogin(username, password).then((response) => {
                        if (response.status === 200) {
                          router.push("/createroom");
                        }
                      });
                }
              }}
              children={isSignup ? "signup" : "Login"}
              className="h-12 w-[100%] mx-auto rounded-md bg-gradient-to-tr from-[#87CEFA]  to-[#4169E1] text-white mt-8 text-xl"
            ></Button>
          </div>
        </div>
        <h1 className="text-center text-white mt-4">
          {isSignup ? (
            <p>
              alredy have an account?{" "}
              <Link href={"/login"} className="ml-1">
                Login
              </Link>
            </p>
          ) : (
            <p>
              don't have an account?
              <Link href={"/signup"} className="ml-1">
                signup
              </Link>
            </p>
          )}
        </h1>
      </div>
    </div>
  );
}

export default Authpage;
