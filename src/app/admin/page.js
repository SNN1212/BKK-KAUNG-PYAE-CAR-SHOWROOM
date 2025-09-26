import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="w-full max-w-3xl flex flex-col items-center gap-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center">
          BKK KAUNG PYAE CAR SHOWROOM
        </h1>
        <p className="text-center text-black/70 dark:text-white/70">
          This is a placeholder. Build your admin features here.
        </p>
        <Link
          href="/"
          className="rounded-full border border-black/[.08] dark:border-white/[.145] px-5 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
        >
          ← Back to role selection
        </Link>
      </main>
    </div>
  );
}


