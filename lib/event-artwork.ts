type ArtworkShape = "wide" | "poster";

const palettes: Record<string, [string, string, string]> = {
  music: ["#171235", "#723d98", "#ff8b83"],
  entertainment: ["#271646", "#ad326e", "#ffbd69"],
  art: ["#173f50", "#2b8c8a", "#f4bc83"],
  business: ["#18263e", "#416ba2", "#7dd5d0"],
  education: ["#213e41", "#528664", "#e4d178"],
  health: ["#24475c", "#4e9b9a", "#b3ddbb"],
  food: ["#553124", "#b76045", "#ffca81"],
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character] ?? character);
}

export function eventArtwork(title: string, category: string, shape: ArtworkShape): string {
  let hash = 2166136261;
  for (let index = 0; index < title.length; index++) {
    hash = Math.imul(hash ^ title.charCodeAt(index), 16777619);
  }
  const variant = hash >>> 0;
  const [dark, mid, light] = palettes[category.toLowerCase()] ?? palettes.art;
  const wide = shape === "wide";
  const width = wide ? 1600 : 900;
  const height = wide ? 900 : 1125;
  const inset = wide ? 105 : 68;
  const circleX = Math.round(width * (0.62 + (variant % 17) / 100));
  const circleY = Math.round(height * (0.3 + ((variant >>> 5) % 20) / 100));
  const angle = 18 + (variant % 55);
  const categoryLabel = escapeXml(category.toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" font-family="Arial,Helvetica,sans-serif" role="img" aria-label="Illustrated event listing for ${escapeXml(title)}">
    <defs>
      <linearGradient id="background" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
      <linearGradient id="shade" x2="0" y2="1"><stop stop-color="${dark}" stop-opacity="0"/><stop offset="1" stop-color="${dark}" stop-opacity=".95"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#background)"/>
    <circle cx="${circleX}" cy="${circleY}" r="${Math.round(width * .32)}" fill="${light}" opacity=".82"/>
    <circle cx="${circleX}" cy="${circleY}" r="${Math.round(width * .23)}" fill="none" stroke="#fff" stroke-width="3" opacity=".42"/>
    <circle cx="${circleX}" cy="${circleY}" r="${Math.round(width * .13)}" fill="${dark}" opacity=".3"/>
    <rect x="${Math.round(width * .1)}" y="${Math.round(height * .14)}" width="${Math.round(width * .8)}" height="${Math.round(height * .12)}" rx="40" fill="#fff" opacity=".1" transform="rotate(${angle} ${Math.round(width / 2)} ${Math.round(height / 2)})"/>
    <path d="M0 ${Math.round(height * .5)} Q${Math.round(width * .3)} ${Math.round(height * .2)} ${width} ${Math.round(height * .6)}" fill="none" stroke="#fff" stroke-width="4" opacity=".25"/>
    <rect y="${Math.round(height * .42)}" width="${width}" height="${Math.round(height * .58)}" fill="url(#shade)"/>
    <text x="${inset}" y="${inset + 20}" fill="#fff" font-size="${wide ? 29 : 24}" font-weight="700" letter-spacing="6" opacity=".9">EVENT LISTING</text>
    <text x="${inset}" y="${wide ? inset + 82 : height - 70}" fill="${light}" font-size="${wide ? 28 : 30}" font-weight="700" letter-spacing="4">${categoryLabel}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
