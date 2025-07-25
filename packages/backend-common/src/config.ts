import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

console.log(process.env.JWT_SECRET);

export const JWT_SECRATE = process.env.JWT_SECRET || "123random";
