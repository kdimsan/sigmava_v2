import { login } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex flex-auto items-center w-full h-screen">
      <div className="h-full w-1/2">
        {/*
        Imagem da esquerda
        */}
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-center -mt-10 px-10">
        <h1 className="text-[32px] max-w-[293px] text-center font-medium mb-8">
          <span className="text-blue-600 font-bold">
            A sua Câmara<br /> Municipal,
          </span>
          
          <span className="text-gray-400 font-light"> agora em <br />Video Atendimento</span>
        </h1>

        <form className="w-full max-w-[372px] flex flex-col gap-4 items-center">
          <div className="w-full flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase text-gray-500"
              htmlFor="email"
            >
              Nome
            </label>
            <input
              className="w-full p-3 text-sm text-gray-800 bg-gray-100 font-medium rounded-md"
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
              className="w-full p-3 text-sm text-gray-800 bg-gray-100 font-medium rounded-md"
              id="password"
              placeholder="Ex: ********"
              name="password"
              type="password"
              required
            />
          </div>

          <button
            className="w-full max-w-[275px] bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-md p-3 mt-4 shadow shadow-blue-400"
            formAction={login}
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
