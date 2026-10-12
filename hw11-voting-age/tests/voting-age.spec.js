import { test, expect } from "@playwright/test";

function getVotingMessage(age) {
  if (age >= 18) {
    return "Ви можете голосувати.";
  } else {
    return "Ви ще не можете голосувати.";
  }
}

test("User aged 17 cannot vote", () => {
    expect(getVotingMessage(17)).toBe("Ви ще не можете голосувати.");
});

test("User aged 18 can vote", () => {
    expect(getVotingMessage(18)).toBe("Ви можете голосувати.");
});

test("User aged 19 can vote", () => {
    expect(getVotingMessage(19)).toBe("Ви можете голосувати.");
});

test("User aged 10 cannot vote", () => {
    expect(getVotingMessage(10)).toBe("Ви ще не можете голосувати.");
});

test("User aged 30 can vote", () => {
    expect(getVotingMessage(30)).toBe("Ви можете голосувати.");
});