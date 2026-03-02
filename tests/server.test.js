import { describe, it, expect } from "vitest";
import request from "supertest";

process.env.APP_PASSWORD = "test-password";
process.env.ANTHROPIC_API_KEY = "sk-ant-test-key";
process.env.NODE_ENV = "test";

const app = (await import("../server.js")).default;

async function getAuthCookie() {
  const res = await request(app)
    .post("/login")
    .send({ password: "test-password" });
  const setCookie = res.headers["set-cookie"];
  return setCookie[0].split(";")[0];
}

describe("Auth", () => {
  it("rejects invalid password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("accepts valid password and sets cookie", async () => {
    const res = await request(app)
      .post("/login")
      .send({ password: "test-password" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("auth-check returns false without cookie", async () => {
    const res = await request(app).get("/auth-check");
    expect(res.body.authenticated).toBe(false);
  });

  it("auth-check returns true with valid cookie", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/auth-check")
      .set("Cookie", cookie);
    expect(res.body.authenticated).toBe(true);
  });
});

describe("Routes", () => {
  it("serves index.html at /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Support Reply");
  });

  it("rejects draft-reply without auth", async () => {
    const res = await request(app)
      .post("/draft-reply")
      .send({ email: "How do I edit my homepage?" });
    expect(res.status).toBe(401);
  });

  it("rejects draft-reply without email", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/draft-reply")
      .set("Cookie", cookie)
      .send({});
    expect(res.status).toBe(400);
  });

  it("rejects draft-reply with empty email", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/draft-reply")
      .set("Cookie", cookie)
      .send({ email: "   " });
    expect(res.status).toBe(400);
  });
});

describe("Generate helpers", () => {
  it("extracts triage from response text", async () => {
    const { extractTriage, stripTriageTag } = await import("../generate.js");
    expect(extractTriage("Here is a reply\n\n[NEEDS TROY]")).toBe("needs-troy");
    expect(extractTriage("Here is a reply\n\n[ROUTINE]")).toBe("routine");
    expect(extractTriage("No tag here")).toBe("routine");
  });

  it("strips triage tags from text", async () => {
    const { stripTriageTag } = await import("../generate.js");
    expect(stripTriageTag("Reply text\n\n[NEEDS TROY]")).toBe("Reply text");
    expect(stripTriageTag("Reply text\n\n[ROUTINE]")).toBe("Reply text");
    expect(stripTriageTag("Just text")).toBe("Just text");
  });
});
