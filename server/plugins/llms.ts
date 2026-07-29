import { llmsFullContent } from "~~/config/llms";

// La route /llms-full.txt ne rend que ce que ce hook pousse (cf. config/llms.ts).
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("llms:generate:full", (_event, _options, contents) => {
    contents.push(llmsFullContent);
  });
});
