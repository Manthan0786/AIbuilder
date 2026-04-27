'use client'

import Image from "next/image";
import Header from "./components/header";
import InputPrompt from "./components/inputprompt";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-100">
      <Header />
      <InputPrompt />
    </div>
  );
}


