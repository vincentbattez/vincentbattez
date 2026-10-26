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

// RFC 2426 : lignes de 75 octets max, suite préfixée d'une espace.
function fold(line: string): string {
  return line.match(/.{1,74}/g)!.join("\r\n ");
}

// vCard 3.0 plutôt que 4.0 : seule version lue partout (iOS Contacts compris).
export function buildVCard(photoBase64: string): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${seo.author.familyName};${seo.author.givenName};;;`,
    `FN:${seo.author.name}`,
    `TITLE:${seo.headline}`,
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
        `${item}.X-ABLabel:${label}`,
      ];
    }),
    fold(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`),
    "END:VCARD",
    "",
  ].join("\r\n");
}
