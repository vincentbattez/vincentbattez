// netlify-cli v27 laisse remonter un ECONNRESET non géré peu après le démarrage de
// `netlify dev`, et son handler uncaughtException tue alors le process. Le capture
// callback court-circuite ce handler : on avale ce seul cas, on relaie le reste.
// NODE_OPTIONS est hérité par les child plugins de @netlify/build, qui s'appuient sur
// leurs propres listeners uncaughtException : on les laisse tranquilles.
if (!process.send) {
  process.setUncaughtExceptionCaptureCallback((err, origin) => {
    if (err && err.code === "ECONNRESET") {
      console.warn("[netlify-dev-guard] ECONNRESET ignoré");
      return;
    }
    const listeners = process.listeners("uncaughtException");
    if (listeners.length === 0) {
      console.error(err);
      process.exit(1);
    }
    for (const listener of listeners) listener(err, origin);
  });
}
