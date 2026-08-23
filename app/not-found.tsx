import Link from "next/link";
import { pathways } from "./content";

export default function NotFound() {
  return (
    <section className="flex min-h-[76svh] flex-col justify-center py-32">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <p className="eyebrow mb-6">404</p>
        <h1 className="display display-lg mb-8">Off the chart</h1>
        <p className="lead mb-12">
          That page doesn&apos;t exist. Here is where most people were heading.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="pill">
            Home
          </Link>
          {pathways.map((pathway) => (
            <Link
              key={pathway.id}
              href={`/solutions/${pathway.id}`}
              className="pill"
            >
              {pathway.name}
            </Link>
          ))}
          <Link href="/contact" className="pill">
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
}
