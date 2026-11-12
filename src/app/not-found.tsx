import Link from "next/link";
import { ArrowLeft } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-28">
      <p className="eyebrow">Error 404</p>
      <h1 className="title-xl mt-6 text-[clamp(4rem,13vw,10rem)]">
        Lost signal<span className="text-muted">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn btn-dark mt-10">
        <ArrowLeft size={16} /> Back home
      </Link>
    </section>
  );
}
