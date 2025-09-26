import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <Image src="/admin.png" alt="" fill priority className="object-cover -z-10" />
      <div className="absolute top-24 sm:top-28 left-0 right-0 flex justify-center px-4">
        <div className="text-center text-white">
          <div className="text-2xl sm:text-3xl font-medium">Welcome to</div>
          <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl font-semibold">
            BKK KAUNG PYAE CAR SHOWROOM
          </h1>
        </div>
      </div>
      <div className="w-full max-w-3xl flex flex-col items-center mt-8 sm:mt-10">

        <div className="grid grid-cols-2 gap-10 w-full place-items-center">
          <Link href="/admin/login" aria-label="Go to Admin" className="cursor-pointer flex flex-col items-center justify-center">
            <span className="inline-flex items-center justify-center h-32 w-32 rounded-full backdrop-blur-md bg-white/10 ring-4 ring-white/60 select-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20 text-white">
                <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </span>
            <div className="mt-3 text-xl font-medium text-white">Admin</div>
          </Link>

          <Link href="/staff" aria-label="Go to Staff" className="cursor-pointer flex flex-col items-center justify-center">
            <span className="inline-flex items-center justify-center h-32 w-32 rounded-full backdrop-blur-md bg-white/10 ring-4 ring-white/60 select-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20 text-white">
                <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.761 0-5 1.79-5 4v1h10v-1c0-2.21-2.239-4-5-4zm8 0c-.686 0-1.336.09-1.938.254 1.73.857 2.938 2.27 2.938 3.746v1H24v-1c0-2.21-2.239-4-5-4z" />
              </svg>
            </span>
            <div className="mt-3 text-xl font-medium text-white">Staff</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
