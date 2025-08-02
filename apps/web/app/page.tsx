import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";
import Navbar from "./component/Navbar";

export default function Home() {
  return (
    <div className="h-screen w-full bg-black">
      <Navbar />
    </div>
  );
}
