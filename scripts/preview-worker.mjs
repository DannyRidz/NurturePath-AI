// This function is embedded with immutable exported assets into the Site Worker.
// Authentication remains the Sites platform's owner-only access boundary.
export function createPreviewWorker(assets) {
  const headers = {
    "Cache-Control": "private, no-store",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
    "Strict-Transport-Security": "max-age=31536000",
    "Content-Security-Policy":
      "object-src 'none'; base-uri 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com",
  };
  return {
    fetch(request) {
      if (!["GET", "HEAD"].includes(request.method))
        return new Response("Only read requests are supported.", {
          status: 405,
          headers: { ...headers, Allow: "GET, HEAD" },
        });
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(request.url).pathname);
      } catch {
        return new Response("Invalid resource path.", { status: 400, headers });
      }
      const blocked = pathname
        .split("/")
        .some((part) => part.startsWith(".") || part === "_headers");
      const candidates = blocked
        ? []
        : [
            pathname,
            `${pathname}.html`,
            `${pathname.replace(/\/$/, "")}/index.html`,
          ];
      const match = candidates.find((path) =>
        Object.prototype.hasOwnProperty.call(assets, path),
      );
      const asset = assets[match ?? "/404.html"];
      if (!asset)
        return new Response("Resource unavailable.", { status: 404, headers });
      const body =
        request.method === "HEAD"
          ? null
          : asset.binary
            ? Uint8Array.from(atob(asset.body), (char) => char.charCodeAt(0))
            : asset.body;
      return new Response(body, {
        status: match ? 200 : 404,
        headers: { ...headers, "Content-Type": asset.contentType },
      });
    },
  };
}
