"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { BACKEND_URL } from "../config/config";

export async function useLogin(name: string, password: string) {
  const response: any = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
    name: name,
    password: password,
  });

  const token = response.data.token;

  localStorage.setItem("token", token);

  return response;
}

export default useLogin;
