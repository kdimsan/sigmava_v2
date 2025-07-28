import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col p-10 w-full min-h-screen md:flex-row md:items-center">
      <div className="flex w-full h-full justify-center items-center md:w-1/2 md:">
        <div className="flex flex-col gap-[76px]">
          <div className="w-full mx-auto">
            <img className="mx-auto" src={"/sigmava_logo.png"} />
          </div>
          <div>
            {/* Imagem para telas pequenas */}
            <img
              className="block md:hidden w-[300px]"
              src={"/ilus_1.png"}
              alt="Ilustração"
            />
            {/* Imagem para tablet ou maior */}
            <img
              className="hidden md:block w-[570px]"
              src={"/big-login.png"}
              alt="Ilustração grande"
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center md:-mt-10 md:px-10">
        <h1 className="text-[32px] w-fit text-start font-medium mb-8 mx-auto">
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
        <Link
          className="w-full max-w-[275px] bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-md p-3 mt-4 shadow shadow-blue-400"
          href={"/login"}
        >
          Login
        </Link>
      </div>
    </main>
  );
}
