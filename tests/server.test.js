import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

process.env.APP_PASSWORD = "test-password";
process.env.ANTHROPIC_API_KEY = "sk-ant-test-key";
process.env.NODE_ENV = "test";

const app = (await import("../server.js")).default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const incidentsPath = path.join(__dirname, "..", "knowledge", "incidents.md");

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
  let incidentsSnapshot;
  beforeAll(() => { incidentsSnapshot = fs.readFileSync(incidentsPath, "utf-8"); });
  afterAll(() => { fs.writeFileSync(incidentsPath, incidentsSnapshot, "utf-8"); });

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

describe("Knowledge endpoint", () => {
  const hostingPath = path.join(__dirname, "..", "knowledge", "hosting.md");
  let hostingSnapshot;
  beforeAll(() => { hostingSnapshot = fs.readFileSync(hostingPath, "utf-8"); });
  afterAll(() => { fs.writeFileSync(hostingPath, hostingSnapshot, "utf-8"); });

  it("rejects without auth", async () => {
    const res = await request(app)
      .post("/knowledge")
      .send({ category: "hosting", content: "Test heading\nTest content" });
    expect(res.status).toBe(401);
  });

  it("rejects without category", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/knowledge")
      .set("Cookie", cookie)
      .send({ content: "Test heading\nTest content" });
    expect(res.status).toBe(400);
  });

  it("rejects without content", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/knowledge")
      .set("Cookie", cookie)
      .send({ category: "hosting" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid category", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/knowledge")
      .set("Cookie", cookie)
      .send({ category: "../../etc/passwd", content: "Test\nBody" });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid category");
  });

  it("uses first line as heading", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/knowledge")
      .set("Cookie", cookie)
      .send({
        category: "hosting",
        content: "Test Provider\n- **Type:** Test hosting\n- **Notes:** Automated test entry",
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.title).toBe("Test Provider");
    expect(res.body.category).toBe("hosting");

    const fileContent = fs.readFileSync(hostingPath, "utf-8");
    expect(fileContent).toContain("## Test Provider");
    expect(fileContent).toContain("- **Type:** Test hosting");
  });
});

describe("Knowledge format endpoint", () => {
  it("rejects without auth", async () => {
    const res = await request(app)
      .post("/knowledge/format")
      .send({ category: "hosting", content: "Some raw content" });
    expect(res.status).toBe(401);
  });

  it("rejects without category", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/knowledge/format")
      .set("Cookie", cookie)
      .send({ content: "Some raw content" });
    expect(res.status).toBe(400);
  });

  it("rejects without content", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/knowledge/format")
      .set("Cookie", cookie)
      .send({ category: "hosting" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid category", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/knowledge/format")
      .set("Cookie", cookie)
      .send({ category: "../../etc/passwd", content: "Some content" });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid category");
  });
});

describe("Knowledge browse endpoint", () => {
  it("rejects without auth", async () => {
    const res = await request(app).get("/knowledge/browse");
    expect(res.status).toBe(401);
  });

  it("returns knowledge index with auth", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/knowledge/browse")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const first = res.body[0];
    expect(first).toHaveProperty("category");
    expect(first).toHaveProperty("label");
    expect(first).toHaveProperty("filename");
    expect(first).toHaveProperty("sectionCount");
    expect(first).toHaveProperty("sections");
    expect(Array.isArray(first.sections)).toBe(true);
  });

  it("includes all knowledge files", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/knowledge/browse")
      .set("Cookie", cookie);
    const categories = res.body.map(c => c.category);
    expect(categories).toContain("hosting");
    expect(categories).toContain("clients");
    expect(categories).toContain("incidents");
  });

  it("sections have title and content", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/knowledge/browse")
      .set("Cookie", cookie);
    const hostingCat = res.body.find(c => c.category === "hosting");
    expect(hostingCat.sections.length).toBeGreaterThan(0);
    expect(hostingCat.sections[0]).toHaveProperty("title");
    expect(hostingCat.sections[0]).toHaveProperty("content");
    expect(hostingCat.sections[0].title.length).toBeGreaterThan(0);
  });
});

describe("GET /incidents endpoint", () => {
  it("rejects without auth", async () => {
    const res = await request(app).get("/incidents");
    expect(res.status).toBe(401);
  });

  it("returns incidents array with auth", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/incidents")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("incidents have expected fields", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/incidents")
      .set("Cookie", cookie);
    if (res.body.length > 0) {
      const first = res.body[0];
      expect(first).toHaveProperty("date");
      expect(first).toHaveProperty("title");
      expect(first).toHaveProperty("severity");
      expect(first).toHaveProperty("description");
    }
  });
});

describe("Q&A with history", () => {
  it("still requires question even with history", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/ask")
      .set("Cookie", cookie)
      .send({
        history: [{ role: "user", content: "old question" }],
      });
    expect(res.status).toBe(400);
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

  it("getKnowledgeIndex returns structured data", async () => {
    const { getKnowledgeIndex } = await import("../generate.js");
    const index = getKnowledgeIndex();
    expect(Array.isArray(index)).toBe(true);
    expect(index.length).toBeGreaterThan(0);
    expect(index[0]).toHaveProperty("category");
    expect(index[0]).toHaveProperty("sections");
  });

  it("getIncidents parses incidents.md", async () => {
    const { getIncidents } = await import("../generate.js");
    const incidents = getIncidents();
    expect(Array.isArray(incidents)).toBe(true);
    if (incidents.length > 0) {
      expect(incidents[0]).toHaveProperty("date");
      expect(incidents[0]).toHaveProperty("title");
    }
  });

  it("buildQAParams works without history", async () => {
    const { buildQAParams } = await import("../generate.js");
    const params = buildQAParams("Test question");
    expect(params.messages).toHaveLength(1);
    expect(params.messages[0].role).toBe("user");
  });

  it("buildQAParams works with history", async () => {
    const { buildQAParams } = await import("../generate.js");
    const params = buildQAParams("Follow-up", null, [
      { role: "user", content: "First question" },
      { role: "assistant", content: "First answer" },
    ]);
    expect(params.messages.length).toBe(3);
    expect(params.messages[0].role).toBe("user");
    expect(params.messages[1].role).toBe("assistant");
    expect(params.messages[2].role).toBe("user");
  });

  it("getHelpDocs returns structured data with pages and guides", async () => {
    const { getHelpDocs } = await import("../generate.js");
    const docs = getHelpDocs();
    expect(docs).toHaveProperty("pages");
    expect(docs).toHaveProperty("guides");
    expect(Array.isArray(docs.pages)).toBe(true);
    expect(Array.isArray(docs.guides)).toBe(true);
    expect(docs.pages.length).toBeGreaterThan(0);
    expect(docs.guides.length).toBeGreaterThan(0);
  });

  it("getHelpDocs pages have title, url, description", async () => {
    const { getHelpDocs } = await import("../generate.js");
    const docs = getHelpDocs();
    const page = docs.pages[0];
    expect(page).toHaveProperty("title");
    expect(page).toHaveProperty("url");
    expect(page).toHaveProperty("description");
    expect(page.url).toMatch(/^https?:\/\//);
  });

  it("getHelpDocs guides have title, url, description, category", async () => {
    const { getHelpDocs } = await import("../generate.js");
    const docs = getHelpDocs();
    const guide = docs.guides[0];
    expect(guide).toHaveProperty("title");
    expect(guide).toHaveProperty("url");
    expect(guide).toHaveProperty("description");
    expect(guide).toHaveProperty("category");
    expect(guide.url).toMatch(/^https?:\/\//);
  });
});

describe("GET /help-docs endpoint", () => {
  it("rejects without auth", async () => {
    const res = await request(app).get("/help-docs");
    expect(res.status).toBe(401);
  });

  it("returns help docs with auth", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/help-docs")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("pages");
    expect(res.body).toHaveProperty("guides");
    expect(Array.isArray(res.body.pages)).toBe(true);
    expect(Array.isArray(res.body.guides)).toBe(true);
  });
});
