import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackServerEvent } from "../lib/analytics";
import { sendPushover } from "../lib/pushover";
import notifyCall from "./notify-call.mts";

vi.mock("../lib/analytics", () => ({ trackServerEvent: vi.fn() }));

const fetchMock = vi.fn<typeof fetch>();

function sentBody(): URLSearchParams {
  const init = fetchMock.mock.calls[0]?.[1];
  return init?.body as URLSearchParams;
}

beforeEach(() => {
  vi.stubEnv("PUSHOVER_APP_TOKEN", "app-token");
  vi.stubEnv("PUSHOVER_USER_KEY", "user-key");
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("notify-call", () => {
  it("envoie la notif /go/call en Emergency, répétée toutes les 30 s pendant 5 min", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

    const response = await notifyCall(new Request("https://x.test/go/call"));

    expect(response.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentBody().get("priority")).toBe("2");
    expect(sentBody().get("retry")).toBe("30");
    expect(sentBody().get("expire")).toBe("300");
    expect(trackServerEvent).toHaveBeenCalledOnce();
  });

  it("signale un refus de Pushover sans renvoyer de notif normale ni d'analytique", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 400 }));

    const response = await notifyCall(new Request("https://x.test/go/call"));

    expect(response.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(trackServerEvent).not.toHaveBeenCalled();
  });
});

describe("sendPushover", () => {
  it("garde le niveau normal quand emergency est absent", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

    await sendPushover({ title: "t", message: "m" });

    expect(sentBody().has("priority")).toBe(false);
    expect(sentBody().has("retry")).toBe(false);
    expect(sentBody().has("expire")).toBe(false);
  });
});
