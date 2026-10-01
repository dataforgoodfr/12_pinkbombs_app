import { afterEach, describe, expect, it, jest } from "@jest/globals";

import handler from "@/pages/api/newsletter/subscribe";

const createResponse = () => {
  const response = {
    json: jest.fn(),
    setHeader: jest.fn(),
    status: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

describe("newsletter subscribe API", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_NEWSLETTER_LIST_ID;
  });

  it("rejects invalid email addresses before calling Brevo", async () => {
    const response = createResponse();

    await handler(
      { method: "POST", body: { email: "invalid" } } as never,
      response as never,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "invalid_email",
    });
  });

  it("subscribes the normalized email to the configured list", async () => {
    process.env.BREVO_API_KEY = "secret";
    process.env.BREVO_NEWSLETTER_LIST_ID = "42";
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue({ ok: true, status: 201 } as Response);
    global.fetch = fetchMock as typeof fetch;
    const response = createResponse();

    await handler(
      { method: "POST", body: { email: " Person@Example.com " } } as never,
      response as never,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/contacts",
      expect.objectContaining({
        headers: expect.objectContaining({ "api-key": "secret" }),
        body: JSON.stringify({
          email: "person@example.com",
          listIds: [42],
          updateEnabled: true,
        }),
      }),
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ success: true });
  });

  it("hides Brevo failures behind a generic response", async () => {
    process.env.BREVO_API_KEY = "secret";
    process.env.BREVO_NEWSLETTER_LIST_ID = "42";
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response) as typeof fetch;
    const response = createResponse();

    await handler(
      { method: "POST", body: { email: "person@example.com" } } as never,
      response as never,
    );

    expect(response.status).toHaveBeenCalledWith(502);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "brevo",
    });
  });

  it("accepts an already subscribed contact as an idempotent success", async () => {
    process.env.BREVO_API_KEY = "secret";
    process.env.BREVO_NEWSLETTER_LIST_ID = "42";
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ code: "duplicate_parameter" }),
    } as Response) as typeof fetch;
    const response = createResponse();

    await handler(
      { method: "POST", body: { email: "person@example.com" } } as never,
      response as never,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      error: "already_subscribed",
    });
  });
});
