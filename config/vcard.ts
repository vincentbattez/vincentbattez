// Source de vérité de la fiche contact servie par /go/get-contact. Prérendue en
// fichier statique (server/routes) : les en-têtes de prod vivent dans netlify.toml.

import { seo } from "./seo";

export const vcardPath = "/vincent-battez.vcf";
export const vcardFilename = vcardPath.slice(1);
// Copie JPEG de public/images/vincentbattez.webp : WebP illisible par Contacts.
export const vcardPhotoAsset = "vincentbattez-contact.jpg";

// Format IMPP/X-ABLabel d'Apple : libellés « LinkedIn », « Github »… dans iOS.
const profiles = [
  { label: "LinkedIn", url: seo.social.linkedin },
  { label: "Portfolio", url: seo.siteUrl },
  { label: "Github", url: seo.social.github },
  { label: "Codepen", url: seo.social.codepen },
];

// RFC 2426 §4 : `\`, `,`, `;` et sauts de ligne sont échappés dans les valeurs
// texte (sinon une virgule dans `seo.headline` couperait le TITLE en liste).
function escapeText(value: string): string {
  return value.replace(/[\\,;]/g, "\\$&").replace(/\r?\n/g, "\\n");
}

function utf8Length(char: string): number {
  const codePoint = char.codePointAt(0)!;
  if (codePoint < 0x80) return 1;
  if (codePoint < 0x800) return 2;
  return codePoint < 0x10000 ? 3 : 4;
}

// RFC 2425 §5.8.1 : 75 octets max par ligne, suite préfixée d'une espace. Compte
// en octets UTF-8 sans couper un caractère (accents du TITLE).
function fold(line: string): string {
  const lines: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const charSize = utf8Length(char);
    if (size + charSize > 75) {
      lines.push(current);
      current = " ";
      size = 1;
    }
    current += char;
    size += charSize;
  }
  lines.push(current);
  return lines.join("\r\n");
}

// vCard 3.0 plutôt que 4.0 : seule version lue partout (iOS Contacts compris).
export function buildVCard(photoBase64: string): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeText(seo.author.familyName)};${escapeText(seo.author.givenName)};;;`,
    `FN:${escapeText(seo.author.name)}`,
    `TITLE:${escapeText(seo.headline)}`,
    `item1.EMAIL;type=INTERNET;type=pref:${seo.author.email}`,
    "item1.X-ABLabel:pro",
    `TEL;type=CELL;type=VOICE;type=pref:${seo.author.phone}`,
    `BDAY:${seo.author.birthDate}`,
    ...profiles.flatMap(({ label, url }, index) => {
      const item = `item${index + 2}`;
      const value = url.replace("://", "%3A//");
      const pref = index === 0 ? ";type=pref" : "";
      return [
        `${item}.IMPP;X-SERVICE-TYPE=${label}${pref}:x-apple:${value}`,
        `${item}.X-ABLabel:${escapeText(label)}`,
      ];
    }),
    `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`,
    "END:VCARD",
  ]
    .map((line) => `${fold(line)}\r\n`)
    .join("");
}
