import Link from "next/link";

export default function VerifiedPage() {
  return (
    <div className="mx-auto mt-16 max-w-xl px-4 text-center sm:mt-24">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Email verified</h1>
      <p className="mt-3 text-base text-gray-500 sm:text-lg">
        Your account has been confirmed. You can now sign in.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Back to home
      </Link>
    </div>
  );
}
