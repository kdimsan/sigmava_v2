import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col p-10 md:flex-row w-full min-h-screen">
      <div className="flex w-full md:w-1/2 h-full justify-center items-center">
        <div className="flex flex-col gap-[76px]">
          <div className="w-full mx-auto">
            <img className="mx-auto" src={"/sigmava_logo.png"} />
          </div>
          <div className="w-[300px]">
            <img className="w-full" src={"/ilus_1.png"} />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center md:-mt-10 md:px-10">
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
