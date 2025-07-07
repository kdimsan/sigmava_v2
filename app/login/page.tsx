import Link from "next/link";
import { login } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="hidden md:flex w-full md:w-1/2 min-h-screen justify-center items-center p-6 md:p-10">
        <div className="flex flex-col gap-8 md:gap-16 items-center">
          <div className="w-full max-w-[100px] md:max-w-[100px] mx-auto">
            <img className="w-full h-auto mx-auto" src={"/sigmava_logo.png"} alt="Sigmava Logo" />
          </div>
          <div className="w-full max-w-[800px] md:max-w-[900px] mx-auto">
            <img className="w-full h-auto mx-auto" src={"/ilus_1.png"} alt="Illustration" />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-start md:justify-center items-center px-4 py-6 md:p-10 pt-16 md:pt-6">
        <div className="md:hidden w-full max-w-[150px] mb-8 mx-auto">
          <img className="w-full h-auto mx-auto" src={"/sigmava_logo.png"} alt="Sigmava Logo" />
        </div>
        <span className="text-sm md:text-base">Entre na sua conta</span>
        <h1 className="text-2xl md:text-[32px] max-w-[293px] text-center font-medium mb-6 md:mb-8">
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

        <form className="w-full md:max-w-[372px] flex flex-col gap-3 md:gap-4 items-center">
          <div className="w-full flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase text-gray-500"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full p-2 md:p-3 text-sm text-gray-800 bg-gray-100 font-medium rounded-md"
              id="email"
              placeholder="Primeiro e Último nome"
              name="email"
              type="email"
              required
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
              className="w-full p-2 md:p-3 text-sm text-gray-800 bg-gray-100 font-medium rounded-md"
              id="password"
              placeholder="Ex: ********"
              name="password"
              type="password"
              required
            />
          </div>

          <span className="font-medium text-xs md:text-sm text-center">Não têm conta? <Link className="text-blue-600" href={"/registar"}>Registe-se</Link></span>

          <button
          type="submit"
            className="w-full md:max-w-[275px] bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-md p-2 md:p-3 mt-2 md:mt-4 shadow shadow-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            formAction={login}
            disabled={false}
          >
            <span className="hidden animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Login</span>
          </button>
        </form>
      </div>
    </main>
  );
}
