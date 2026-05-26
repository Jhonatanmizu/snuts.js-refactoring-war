import type { Level } from '@/types/game'

export const levels: Level[] = [
  {
    id: 'mystery-guest',
    name: 'The Mystery Guest',
    flashcard: {
      smellName: 'Mystery Guest',
      description:
        'The test uses data or state that is defined outside of itself (e.g. in a massive beforeEach or an external file), forcing the developer to hunt for the context.',
      language: 'Jest',
      fileName: 'checkout.test.js',
      smellyCode: `test('should allow user to checkout', async () => {
  // Where did globalUser come from? What is its balance?
  const cart = await createCart(globalUser.id);
  const result = await checkout(cart.id);
  expect(result.status).toBe('success');
});`,
      fixCode: `test('should allow user to checkout', async () => {
  const user = await createUserFactory({ balance: 100 });
  const cart = await createCart(user.id);
  const result = await checkout(cart.id);
  expect(result.status).toBe('success');
});`,
    },
    spotSmellChallenge: {
      codeSnippet: `describe('Guest', () => {
  it('sends a thank-you note', () => {
    const guest = { name: 'Alice', email: 'alice@test.com' };
    const mailer = new Mailer();
    expect(mailer.sendThankYou(guest)).toBe(true);
  });
});`,
      options: [
        { id: 'a', smellName: 'Mystery Guest', isCorrect: false },
        { id: 'b', smellName: 'The Eager Test', isCorrect: false },
        { id: 'c', smellName: 'The Local Hero', isCorrect: true },
      ],
    },
    refactoringChallenge: {
      smellyCode: `describe('Guest', () => {
  it('sends a thank-you note', () => {
    const guest = { name: 'Alice', email: 'alice@test.com' };
    const mailer = new Mailer();
    const result = mailer.sendThankYou(guest);
    expect(result).toBe(true);
  });
});`,
      objective:
        'Replace hidden test fixtures with a refactor that names the collaborator clearly.',
      hints: [
        'Look for the option that gives the test data a name and a clear origin.',
        'A builder function reveals intent better than a literal object.',
        'The goal is to kill the Mystery Guest — make the collaborator impossible to ignore.',
      ],
      choices: [
        {
          id: 'mg-refactor-1',
          title: 'Extract a named guest builder',
          description:
            'Create a factory function that makes the test intention clear.',
          code: `function createGuest(name = 'Alice', email?: string) {
  return {
    name,
    email: email ?? name.toLowerCase() + '@test.com',
  };
}

test('sends a thank-you note', () => {
  const guest = createGuest();
  const mailer = new Mailer();
  expect(mailer.sendThankYou(guest)).toBe(true);
});`,
          isCorrect: true,
          explanation:
            'Named builders reveal the domain concept and keep tests expressive.',
          xpReward: 150,
        },
        {
          id: 'mg-refactor-2',
          title: 'Add more assertions to the same test',
          description:
            'Double down by checking more properties in one test block.',
          code: `test('sends a thank-you note', () => {
  const guest = { name: 'Alice', email: 'alice@test.com' };
  const mailer = new Mailer();
  const result = mailer.sendThankYou(guest);
  expect(result).toBe(true);
  expect(mailer.recipient).toBe('alice@test.com');
  expect(mailer.template).toBe('thank-you');
});`,
          isCorrect: false,
          explanation:
            'More assertions only mask the problem; the hidden setup still triggers the smell detector.',
          xpReward: 0,
        },
      ],
    },
    codeEditorChallenge: {
      fileName: 'guest.test.js',
      language: 'Jest',
      objective: 'Extract a named builder function to reveal the test collaborator.',
      smellyCode: `describe('Guest', () => {
  it('sends a thank-you note', () => {
    const guest = { name: 'Alice', email: 'alice@test.com' };
    const mailer = new Mailer();
    expect(mailer.sendThankYou(guest)).toBe(true);
  });
});`,
      fixCode: `function createGuest(name = 'Alice', email?: string) {
  return { name, email: email ?? name.toLowerCase() + '@test.com' };
}

test('sends a thank-you note', () => {
  const guest = createGuest();
  const mailer = new Mailer();
  expect(mailer.sendThankYou(guest)).toBe(true);
});`,
      codeLines: [
        { text: "function ____(name = 'Alice', email?: string) {", highlight: 'blank' },
        { text: "  return { name, email: email ?? name.toLowerCase() + '@test.com' }", highlight: 'none' },
        { text: '}', highlight: 'none' },
        { text: '', highlight: 'none' },
        { text: "test('sends a thank-you note', () => {", highlight: 'none' },
        { text: '  const guest = ____();', highlight: 'blank' },
        { text: '  const mailer = new Mailer();', highlight: 'none' },
        { text: '  expect(mailer.sendThankYou(guest)).toBe(true);', highlight: 'none' },
        { text: '});', highlight: 'none' },
      ],
      blanks: [
        { lineIndex: 0, expected: 'createGuest' },
        { lineIndex: 5, expected: 'createGuest' },
      ],
      hints: [
        'The function name should describe what kind of guest it creates.',
        'Use the same name where the function is called.',
      ],
    },
  },
  {
    id: 'eager-test',
    name: 'The Eager Test',
    flashcard: {
      smellName: 'Eager Test',
      description:
        'A test method that tries to test an entire feature or multiple independent behaviors at once. If it fails, you do not know why without debugging.',
      language: 'Jest',
      fileName: 'user-profile.test.js',
      smellyCode: `test('user profile management feature', async () => {
  const user = await updateProfile(1, { name: 'Alice', bio: 'Dev' });
  expect(user.name).toBe('Alice');

  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);
});`,
      fixCode: `test('should update user profile details', async () => {
  const user = await updateProfile(1, { name: 'Alice' });
  expect(user.name).toBe('Alice');
});

test('should deactivate user account', async () => {
  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);
});`,
    },
    spotSmellChallenge: {
      codeSnippet: `test('user profile management feature', async () => {
  const user = await updateProfile(1, { name: 'Alice' });
  expect(user.name).toBe('Alice');

  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);
});`,
      options: [
        { id: 'a', smellName: 'The Mystery Guest', isCorrect: false },
        { id: 'b', smellName: 'The Eager Test', isCorrect: true },
        { id: 'c', smellName: 'The Local Hero', isCorrect: false },
      ],
    },
    refactoringChallenge: {
      smellyCode: `test('user profile management feature', async () => {
  const user = await updateProfile(1, { name: 'Alice' });
  expect(user.name).toBe('Alice');

  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);
});`,
      objective:
        'Split independent behaviors into distinct, focused test blocks.',
      hints: [
        'Each test should verify one behavior or concept.',
        'If a test name uses "and" or "&", it is likely doing too much.',
        'Smaller tests are easier to debug and maintain.',
      ],
      choices: [
        {
          id: 'et-refactor-1',
          title: 'Split into focused tests',
          description:
            'Each independent behavior gets its own test block.',
          code: `test('should update user profile details', async () => {
  const user = await updateProfile(1, { name: 'Alice' });
  expect(user.name).toBe('Alice');
});

test('should deactivate user account', async () => {
  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);
});`,
          isCorrect: true,
          explanation:
            'Each test now verifies exactly one behavior. A failure pinpoints the issue instantly.',
          xpReward: 150,
        },
        {
          id: 'et-refactor-2',
          title: 'Merge into one big test',
          description:
            'Keep everything together but add more comments.',
          code: `test('user profile management feature', async () => {
  // Step 1: Update profile
  const user = await updateProfile(1, { name: 'Alice' });
  expect(user.name).toBe('Alice');

  // Step 2: Deactivate
  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);

  // TODO: Add reactivate test here
});`,
          isCorrect: false,
          explanation:
            'Comments do not fix the problem. The test still checks two independent behaviors.',
          xpReward: 0,
        },
      ],
    },
    codeEditorChallenge: {
      fileName: 'user-profile.test.js',
      language: 'Jest',
      objective: 'Split the eager test into two focused test blocks.',
      smellyCode: `test('user profile management feature', async () => {
  const user = await updateProfile(1, { name: 'Alice' });
  expect(user.name).toBe('Alice');

  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);
});`,
      fixCode: `test('should update user profile details', async () => {
  const user = await updateProfile(1, { name: 'Alice' });
  expect(user.name).toBe('Alice');
});

test('should deactivate user account', async () => {
  const deactivated = await deactivateUser(1);
  expect(deactivated.isActive).toBe(false);
});`,
      codeLines: [
        { text: "____('should update user profile details', async () => {", highlight: 'blank' },
        { text: "  const user = await updateProfile(1, { name: 'Alice' });", highlight: 'none' },
        { text: "  expect(user.name).toBe('Alice');", highlight: 'none' },
        { text: '});', highlight: 'none' },
        { text: '', highlight: 'none' },
        { text: "____('should deactivate user account', async () => {", highlight: 'blank' },
        { text: '  const deactivated = await deactivateUser(1);', highlight: 'none' },
        { text: '  expect(deactivated.isActive).toBe(false);', highlight: 'none' },
        { text: '});', highlight: 'none' },
      ],
      blanks: [
        { lineIndex: 0, expected: 'test' },
        { lineIndex: 5, expected: 'test' },
      ],
      hints: [
        'Each test block starts with the same keyword.',
        'Look at how the original test was written — each block needs the same declarator.',
      ],
    },
  },
  {
    id: 'local-hero',
    name: 'The Local Hero',
    flashcard: {
      smellName: 'Local Hero',
      description:
        'A test that passes locally but fails in CI because it relies on specific local environment variables, files, or hardcoded dates unique to the developer machine.',
      language: 'Jest',
      fileName: 'invoice.test.js',
      smellyCode: `test('should generate invoice number', () => {
  // Works on my machine — but CI has different TZ
  const today = new Date();
  const invoiceNo = \`INV-\${today.getFullYear()}-\${Math.random()}\`;
  expect(invoiceNo).toMatch(/^INV-/);
});`,
      fixCode: `test('should generate invoice number', () => {
  const today = new Date('2025-06-01T12:00:00Z');
  const invoiceNo = \`INV-\${today.getFullYear()}-\${crypto.randomUUID()}\`;
  expect(invoiceNo).toMatch(/^INV-/);
});`,
    },
    spotSmellChallenge: {
      codeSnippet: `test('should generate invoice number', () => {
  const today = new Date();
  const invoiceNo = \`INV-\${today.getFullYear()}-\${Math.random()}\`;
  expect(invoiceNo).toMatch(/^INV-/);
});`,
      options: [
        { id: 'a', smellName: 'The Mystery Guest', isCorrect: false },
        { id: 'b', smellName: 'The Eager Test', isCorrect: false },
        { id: 'c', smellName: 'The Local Hero', isCorrect: true },
      ],
    },
    refactoringChallenge: {
      smellyCode: `test('should generate invoice number', () => {
  const today = new Date();
  const invoiceNo = \`INV-\${today.getFullYear()}-\${Math.random()}\`;
  expect(invoiceNo).toMatch(/^INV-/);
});`,
      objective:
        'Eliminate non-determinism by controlling the date and using a proper unique ID.',
      hints: [
        'Floating dates make tests non-deterministic across environments.',
        'Math.random() cannot be reliably tested. Use a seeded or mockable alternative.',
        'A deterministic test always produces the same result on every run.',
      ],
      choices: [
        {
          id: 'lh-refactor-1',
          title: 'Control the date and use a proper UUID',
          description:
            'Pin the date so the test produces the same result everywhere.',
          code: `test('should generate invoice number', () => {
  const today = new Date('2025-06-01T12:00:00Z');
  const invoiceNo = \`INV-\${today.getFullYear()}-\${crypto.randomUUID()}\`;
  expect(invoiceNo).toMatch(/^INV-2025-/);
});`,
          isCorrect: true,
          explanation:
            'A fixed date makes the test deterministic. crypto.randomUUID() produces a valid, testable ID.',
          xpReward: 150,
        },
        {
          id: 'lh-refactor-2',
          title: 'Mock the Date constructor globally',
          description:
            'Use jest.useFakeTimers to freeze time.',
          code: `beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-06-01'));
});

test('should generate invoice number', () => {
  const today = new Date();
  const invoiceNo = \`INV-\${today.getFullYear()}-\${Math.random()}\`;
  expect(invoiceNo).toMatch(/^INV-2025-/);
});`,
          isCorrect: false,
          explanation:
            'Fake timers work here, but the real smell is Math.random(). The test still has a non-deterministic component.',
          xpReward: 0,
        },
      ],
    },
    codeEditorChallenge: {
      fileName: 'invoice.test.js',
      language: 'Jest',
      objective: 'Replace non-deterministic values with controlled ones.',
      smellyCode: `test('should generate invoice number', () => {
  const today = new Date();
  const invoiceNo = \`INV-\${today.getFullYear()}-\${Math.random()}\`;
  expect(invoiceNo).toMatch(/^INV-/);
});`,
      fixCode: `test('should generate invoice number', () => {
  const today = new Date('2025-06-01T12:00:00Z');
  const invoiceNo = \`INV-\${today.getFullYear()}-\${crypto.randomUUID()}\`;
  expect(invoiceNo).toMatch(/^INV-2025-/);
});`,
      codeLines: [
        { text: "test('should generate invoice number', () => {", highlight: 'none' },
        { text: '  const today = ____;', highlight: 'blank' },
        { text: '  const invoiceNo = `INV-${today.getFullYear()}-${crypto.randomUUID()}`;', highlight: 'none' },
        { text: "  expect(invoiceNo).toMatch(/^INV-2025-/);", highlight: 'none' },
        { text: '});', highlight: 'none' },
      ],
      blanks: [
        { lineIndex: 1, expected: "new Date('2025-06-01T12:00:00Z')" },
      ],
      hints: [
        'Freeze the date to a specific value so it works everywhere.',
        'Use the Date constructor with a specific ISO string.',
      ],
    },
  },
]
