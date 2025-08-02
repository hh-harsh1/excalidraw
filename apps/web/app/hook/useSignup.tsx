"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { BACKEND_URL } from "../config/config";

export async function useSignup(name: string, password: string, email: string) {
  const response: any = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
    name: name,
    email: email,
    password: password,
  });
  const data = response.status;
  console.log(data);

  return data;
}

export default useSignup;
