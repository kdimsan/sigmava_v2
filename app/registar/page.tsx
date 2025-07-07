"use client"

import BackButton from "@/components/BackButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      email,
      name,
      password,
    }).toString();

    router.push(`/selecionar-license?${searchParams}`);
  };
  return (
    <main className="flex flex-col p-10 md:flex-row w-full min-h-screen">
      <div className="flex w-full md:w-1/2 h-full justify-center items-center">
        <div className="flex flex-col gap-[76px]">
          <div className="w-full mx-auto">
            <img className="mx-auto" src={"/sigmava_logo.png"} />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center md:-mt-10 md:px-10">
      <BackButton />
        <span>Faça o seu registo</span>
        <h1 className="text-[32px] max-w-[293px] text-center font-medium mb-8">
          <span className="text-blue-600 font-bold">
            A sua Câmara
            <br /> Municipal,
          </span>
          <span className="text-gray-400 font-light">
            {" "}
            agora em <br />
            Video Atendimento
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-[372px] flex flex-col gap-4 items-center">
          <div className="w-full flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase text-gray-500"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full p-3 text-sm text-gray-800 bg-gray-100 font-medium rounded-md"
              id="email"
              placeholder="Primeiro e Último nome"
              name="email"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase text-gray-500"
              htmlFor="email"
            >
              Nome
            </label>
            <input
              className="w-full p-3 text-sm text-gray-800 bg-gray-100 font-medium rounded-md"
              id="name"
              placeholder="Primeiro e Último nome"
              name="name"
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase text-gray-500"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-3 text-sm text-gray-800 bg-gray-100 font-medium rounded-md"
              id="password"
              placeholder="Ex: ********"
              name="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full max-w-[275px] bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-md p-3 mt-4 shadow shadow-blue-400">
            Registar
          </button>
        </form>
      </div>
    </main>
  );
}
