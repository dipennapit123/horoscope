/** Convert YouTube watch / youtu.be URLs to embed URL. */
export function toYoutubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be" && u.pathname.length > 1) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.pathname.includes("/embed/")) {
      return url;
    }
    return url;
  } catch {
    return url;
  }
}
