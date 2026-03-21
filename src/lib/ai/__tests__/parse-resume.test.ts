import { describe, it, expect } from 'vitest';
import { parseAIResponse } from '../parse-resume';

describe('AI response parsing tests', () => {
  const mockValidJSON = {
    name: 'Alice',
    experience: [{ company: 'Test', role: 'Dev', bullets: ['A'] }]
  };

  it('handles raw JSON response (no fences)', () => {
    const rawJSON = JSON.stringify(mockValidJSON, null, 2);
    const parsed = parseAIResponse(rawJSON);
    expect(parsed).toEqual(mockValidJSON);
  });

  it('Extracts JSON from markdown-fenced AI response', () => {
    const markdownResponse = `
Here is your requested data:
\`\`\`json
${JSON.stringify(mockValidJSON, null, 2)}
\`\`\`
Hope this helps!`;
    const parsed = parseAIResponse(markdownResponse);
    expect(parsed).toEqual(mockValidJSON);
  });

  it('throws on completely invalid (non-JSON) response', () => {
    const badResponse = 'This is just a sentence with no JSON object anywhere.';
    expect(() => parseAIResponse(badResponse)).toThrow(/No valid JSON found|Failed to parse/);
  });
});
