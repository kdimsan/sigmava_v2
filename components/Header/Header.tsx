"use client";

import { CalendarDays, History, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutButton from "../LogoutButton";
import UserAdd from "@/assets/svgs/userAdd";
import UsersAdd from "@/assets/svgs/usersAdd";
import Clock from "@/assets/svgs/clock";
import User from "@/assets/svgs/user";
import React, { useState } from "react";
import CreateUserForm from "./forms/createUserForm";
import PopoverItem from "./PopoverItem";
import Department from "./forms/department";
import Availability from "./forms/avaiability";
import Link from "next/link";
import Profile from "../Profile";

interface DepartmentProps {
  id: number;
  name: string;
}

interface HeaderProps {
  user: {
    name: string;
    role?: string;
    avatar?: string;
    logo: string;
  };
  departments: DepartmentProps[];
}

export default function Header({ user, departments }: HeaderProps) {
  const router = useRouter();
  const [activeForm, setActiveForm] = useState<
    null | "user" | "department" | "availability" | "notifications" | "profile"
  >(null);

  const navigationItems = [
    {
      icon: UserAdd,
      label: "UTILIZADORES",
      content: <CreateUserForm departments={departments} />,
    },
    {
      icon: UsersAdd,
      label: "DEPARTAMENTOS",
      content: <Department />,
    },
    {
      icon: Clock,
      label: "DISPONIBILIDADE",
      content: <Availability />,
    },
    {
      icon: PlusCircleIcon,
      label: "AGENDAR CHAMADA",
      isLucide: true,
      path: "/usuario/dashboard/agendar-chamada",
    },
    {
      icon: History,
      label: "HISTÓRICO",
      isLucide: true,
      path: "/usuario/dashboard/historico",
    },
    {
      icon: CalendarDays,
      label: "PRÓXIMOS",
      isLucide: true,
      path: "/usuario/dashboard/proximas-chamadas",
    },
    {
      icon: User,
      label: "O SEU PERFIL",
      path: "/usuario/dashboard/definicoes",
      content: <Profile department={user.role!} name={user.name} />,
    },
  ];
  console.log("header user", user);

  if (user.role === "superuser") {
    return (
      <header className="bg-white border-b border-gray-200 w-11/12 my-2.5 mx-auto rounded-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <Link href={"#/"}>
              <img
                className="w-20"
                src="https://sigmava.pt/licenses_images/logo_sigmaVA_tipografia.svg"
                alt="sigmava"
              />
            </Link>
            <div className="flex items-center gap-2 border-l-2 border-gray-300">
              <div className="bg-gray-300 w-fit p-2 rounded-full ml-3">
                <User className=" size-5" />
              </div>
              <p>{user.role}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <LogoutButton />
          </div>
        </div>
      </header>
    );
  }

  const filteredNavigationItems =
    user.role === "user"
      ? navigationItems.filter(
          (item) =>
            item.label === "AGENDAR CHAMADA" ||
            item.label === "HISTÓRICO" ||
            item.label === "PRÓXIMOS" ||
            item.label === "O SEU PERFIL"
        )
      : user.role === "employee"
      ? navigationItems.filter(
          (item) =>
            item.label === "NOTIFICAÇÕES" ||
            item.label === "O SEU PERFIL" ||
            item.label === "DISPONIBILIDADE"
        )
      : navigationItems.filter((item) => !item.isLucide);

  return (
    <header className="bg-white border-b border-gray-200 w-11/12 my-2.5 mx-auto rounded-md px-6 py-4">
      <div className=" items-center justify-between hidden md:flex">
        {/* Logo e Info do Usuário */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-20 h-12 rounded-lg flex items-center justify-center">
              <img
                className="w-20"
                src={
                  user.logo ||
                  "https://sigmava.pt/licenses_images/logo_sigmaVA_tipografia.svg"
                }
                alt="logo da licença"
              />
            </div>
            {/* NOME, ver com Jose se ele quer ;)
            <div>
              <div className="text-sm font-medium text-gray-900">Câmara</div>
              <div className="text-sm font-medium text-gray-900">Municipal</div>
              <div className="text-xs text-blue-600">V.A de Fafe</div>
            </div> */}
          </button>
          <div className="w-[1px] h-[70px] bg-gray-300"></div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User />
              )}
            </div>
            <div>
              <div className="text-base font-medium text-blue-500">
                {user.name}
              </div>
              <div className="text-xs font-semibold text-gray-800">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Superior */}
        <div className="flex items-center space-x-6">
          {filteredNavigationItems.map((item, i) => {
            const isActive = activeForm === item.label.toLowerCase();

            const handleClick = () => {
              if (user.role === "user" && item.path) {
                router.push(item.path);
              } else {
                setActiveForm(
                  isActive
                    ? null
                    : (item.label.toLowerCase() as typeof activeForm)
                );
              }
            };

            return (
              <PopoverItem
                key={i}
                isActive={isActive}
                onToggle={handleClick}
                trigger={
                  <button
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors
            ${
              isActive
                ? "border-2 border-blue-500 bg-blue-50 text-blue-500"
                : "hover:bg-blue-100/80 border-2 border-transparent"
            }`}
                  >
                    <item.icon
                      className={
                        item.isLucide ? "w-5 h-5 text-blue-500" : undefined
                      }
                    />
                    <span
                      className={`text-xs ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                }
              >
                {user.role !== "user" && item.content
                  ? ({ close }: { close: () => void }) =>
                      React.isValidElement(item.content)
                        ? React.cloneElement(
                            item.content as React.ReactElement<{
                              onCancel: () => void;
                            }>,
                            { onCancel: close }
                          )
                        : item.content
                  : null}
              </PopoverItem>
            );
          })}
          <LogoutButton />
        </div>
      </div>
      <div className="flex flex-col md:hidden">
        <span>Bem vindo {user.name} </span>
        <span>ao SIGMAVA</span>

      </div>
    </header>
  );
}
