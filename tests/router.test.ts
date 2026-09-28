import { describe, expect, it, vi } from 'vitest';
import { routeChat } from '../src/router';

vi.mock('../src/gemini', () => ({
  callGemini: vi.fn()
    .mockRejectedValueOnce(new Error('temporary'))
    .mockRejectedValueOnce(new Error('temporary'))
    .mockResolvedValueOnce({ model: 'model-b', text: 'ok', latencyMs: 12 }),
}));

vi.mock('../src/monitoring', () => ({
  isCoolingDown: vi.fn().mockResolvedValue(false),
  markFailure: vi.fn().mockResolvedValue(undefined),
  markSuccess: vi.fn().mockResolvedValue(undefined),
}));

describe('model router', () => {
  it('falls back after a model failure', async () => {
    const env = {
      MODEL_PRIMARY: 'model-a', MODEL_FALLBACK_1: 'model-b',
    } as never;
    const result = await routeChat(env, { messages: [{ role: 'user', text: 'Hi' }] });
    expect(result.model).toBe('model-b');
  });
});
