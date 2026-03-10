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
    expect(res.text).toContain("Support Hub");
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

describe("Client directory", () => {
  it("rejects without auth", async () => {
    const res = await request(app).get("/clients");
    expect(res.status).toBe(401);
  });

  it("returns client list with auth", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/clients")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("website");
  });
});

describe("Logout", () => {
  it("clears auth cookie", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/logout")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie[0]).toContain("auth_token=;");
  });
});

describe("Q&A endpoint", () => {
  it("rejects without auth", async () => {
    const res = await request(app)
      .post("/ask")
      .send({ question: "How do I edit an article?" });
    expect(res.status).toBe(401);
  });

  it("rejects without question", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/ask")
      .set("Cookie", cookie)
      .send({});
    expect(res.status).toBe(400);
  });

  it("rejects with empty question", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/ask")
      .set("Cookie", cookie)
      .send({ question: "   " });
    expect(res.status).toBe(400);
  });
});

describe("Incidents endpoint", () => {
  it("rejects without auth", async () => {
    const res = await request(app)
      .post("/incidents")
      .send({ title: "Test", description: "Test incident" });
    expect(res.status).toBe(401);
  });

  it("rejects without title", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/incidents")
      .set("Cookie", cookie)
      .send({ description: "Something happened" });
    expect(res.status).toBe(400);
  });

  it("rejects without description", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/incidents")
      .set("Cookie", cookie)
      .send({ title: "Test Incident" });
    expect(res.status).toBe(400);
  });

  it("logs an incident with valid data", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/incidents")
      .set("Cookie", cookie)
      .send({
        title: "Test Incident",
        severity: "Low",
        affected: "None",
        description: "This is a test incident for automated testing",
        resolution: "No action needed",
        handler: "Test Suite",
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.title).toBe("Test Incident");
    expect(res.body.date).toBeDefined();
  });
});

describe("Generate helpers", () => {
  it("extracts triage from response text", async () => {
    const { extractTriage } = await import("../generate.js");
    expect(extractTriage("Here is a reply\n\n[NEEDS TROY]")).toBe("needs-troy");
    expect(extractTriage("Here is a reply\n\n[ROUTINE]")).toBe("routine");
    expect(extractTriage("No tag here")).toBe("routine");
  });

  it("extracts triage with extra whitespace", async () => {
    const { extractTriage } = await import("../generate.js");
    expect(extractTriage("Reply text\n\n[NEEDS TROY]\n")).toBe("needs-troy");
    expect(extractTriage("Reply text  [NEEDS TROY]  ")).toBe("needs-troy");
  });

  it("strips triage tags from text", async () => {
    const { stripTriageTag } = await import("../generate.js");
    expect(stripTriageTag("Reply text\n\n[NEEDS TROY]")).toBe("Reply text");
    expect(stripTriageTag("Reply text\n\n[ROUTINE]")).toBe("Reply text");
    expect(stripTriageTag("Just text")).toBe("Just text");
  });

  it("strips triage tags with varying whitespace", async () => {
    const { stripTriageTag } = await import("../generate.js");
    expect(stripTriageTag("Reply text\n\n\n[NEEDS TROY]\n")).toBe("Reply text");
    expect(stripTriageTag("Reply text\n[ROUTINE]\n")).toBe("Reply text");
    expect(stripTriageTag("Reply text\n\n[NEEDS TROY]  ")).toBe("Reply text");
  });
});
