import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";
import { appRouter } from "./routers";

const mockedInvokeLLM = vi.mocked(invokeLLM);

function createContext(userId?: number): TrpcContext {
  return {
    user: userId
      ? {
          id: userId,
          openId: `user-${userId}`,
          email: "user@example.com",
          name: "Organic Farmer",
          loginMethod: "test",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("ai.chat (Dhenu Central Intelligence)", () => {
  beforeEach(() => {
    mockedInvokeLLM.mockReset();
  });

  it("returns a concise assistant response from the built-in LLM", async () => {
    mockedInvokeLLM.mockResolvedValue({
      id: "test-response",
      created: Date.now(),
      model: "test-model",
      choices: [
        {
          index: 0,
          finish_reason: "stop",
          message: { role: "assistant", content: "Keep fresh water available and check it twice daily." },
        },
      ],
    });

    const caller = appRouter.createCaller(createContext());
    const result = await caller.ai.chat({
      messages: [{ role: "user", content: "What is one simple hydration habit?" }],
    });

    expect(result).toContain("fresh water");
    expect(mockedInvokeLLM).toHaveBeenCalledOnce();
    expect(mockedInvokeLLM.mock.calls[0]?.[0].messages[0]).toMatchObject({ role: "system" });
  });

  it("injects Hindi language directive when language is set to 'hi'", async () => {
    mockedInvokeLLM.mockResolvedValue({
      id: "test-hi-response",
      created: Date.now(),
      model: "test-model",
      choices: [
        {
          index: 0,
          finish_reason: "stop",
          message: {
            role: "assistant",
            content: "देसी गाय का बिलोना घी पाचन तंत्र और शरीर के ओजस के लिए सर्वोत्तम माना जाता है।",
          },
        },
      ],
    });

    const caller = appRouter.createCaller(createContext());
    const result = await caller.ai.chat({
      messages: [{ role: "user", content: "बिलोना घी के लाभ बताएं" }],
      language: "hi",
    });

    expect(result).toContain("देसी गाय");
    const systemPromptContent = mockedInvokeLLM.mock.calls[0]?.[0].messages[0].content as string;
    expect(systemPromptContent).toContain("HINDI (हिंदी)");
  });

  it("handles addToCart tool calls gracefully when customer is unauthenticated", async () => {
    mockedInvokeLLM.mockResolvedValue({
      id: "test-tool-call",
      created: Date.now(),
      model: "test-model",
      choices: [
        {
          index: 0,
          finish_reason: "tool_calls",
          message: {
            role: "assistant",
            content: "",
            tool_calls: [
              {
                id: "call_123",
                type: "function",
                function: {
                  name: "addToCart",
                  arguments: JSON.stringify({ productSlug: "bilona-a2-ghee", quantity: 1 }),
                },
              },
            ],
          },
        },
      ],
    });

    const caller = appRouter.createCaller(createContext()); // no user session
    const result = await caller.ai.chat({
      messages: [{ role: "user", content: "Please add 1 bilona ghee to my cart" }],
    });

    expect(result).toContain("sign in to your Gavyadhenu account");
  });
});
