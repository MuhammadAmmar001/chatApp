import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {

  return (
    <div
      className="flex flex-col min-h-full justify-center bg-gray-100 ">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height='50'
          width='50'
          src='/images/logo2.png'
          className="mx-auto w-auto "
        />

        <h2
          className="text-center mt-6 font-bold text-3xl tracking-tight text-sky-400 "
        >
          Sign in to your account.
        </h2>
        <AuthForm />
      </div>
    </div>
  );
}
