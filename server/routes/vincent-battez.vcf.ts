import { buildVCard, vcardFilename, vcardPhotoAsset } from "~~/config/vcard";

// Prérendue par `nuxt generate` ; ces en-têtes ne valent qu'en dev.
export default defineEventHandler(async (event) => {
  const photo = await useStorage("assets:server").getItemRaw(vcardPhotoAsset);
  setResponseHeaders(event, {
    "Content-Type": "text/vcard; charset=utf-8",
    "Content-Disposition": `attachment; filename="${vcardFilename}"`,
  });
  return buildVCard(Buffer.from(photo).toString("base64"));
});
