'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

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
          <div 
            onClick={() => handleNavigation('/admin/login')}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigation('/admin/login')}
            role="button"
            tabIndex={0}
            aria-label="Go to Admin"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <span className="inline-flex items-center justify-center h-32 w-32 rounded-full backdrop-blur-md bg-white/10 ring-4 ring-white/60 select-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20 text-white">
                <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </span>
            <div className="mt-3 text-xl font-medium text-white">Admin</div>
          </div>

          <div 
            onClick={() => handleNavigation('/staff/dashboard')}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigation('/staff/dashboard')}
            role="button"
            tabIndex={0}
            aria-label="Go to Staff"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <span className="inline-flex items-center justify-center h-32 w-32 rounded-full backdrop-blur-md bg-white/10 ring-4 ring-white/60 select-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20 text-white">
                <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </span>
            <div className="mt-3 text-xl font-medium text-white">Staff</div>
          </div>
        </div>
      </div>
    </div>
  );
}
