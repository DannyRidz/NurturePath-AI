import Link from "next/link";
export default function NotFound() {
  return (
    <section className="page narrow">
      <h1 tabIndex={-1}>This page is not available.</h1>
      <p>You can return home or start a fictional example.</p>
      <Link className="button" href="/">
        Return home
      </Link>
    </section>
  );
}
