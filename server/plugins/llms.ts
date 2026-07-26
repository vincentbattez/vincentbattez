import { llmsFullContent } from "~~/config/llms";

// Injecte le CV détaillé dans /llms-full.txt : la route ne rend que ce que le
// hook pousse (cf. config/llms.ts).
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("llms:generate:full", (_event, _options, contents) => {
    contents.push(llmsFullContent);
  });
});
