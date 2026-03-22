import { describe, expect, it } from "bun:test";
import { bufferToBase64 } from "../../src/shared/utils";

describe("bufferToBase64", () => {
  it("converts a Buffer containing ASCII text to base64", () => {
    const result = bufferToBase64(Buffer.from("hello"));
    expect(result).toBe("aGVsbG8=");
  });

  it("converts an empty Buffer to an empty string", () => {
    const result = bufferToBase64(Buffer.from(""));
    expect(result).toBe("");
  });

  it("converts arbitrary binary data to a base64 string", () => {
    const data = Buffer.from([0xff, 0x00, 0xab]);
    const result = bufferToBase64(data);
    expect(result).toBe(data.toString("base64"));
  });
});
