# C37 · Host Questions and Correlated Answers

Captures and answers a local host question. It does not send a provider user.message. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Questions need correlation
- A current turn binding can expire
- Actual user selection precedes send

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3037`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3037
```

## How the app was build

### 1. Reject a response captured for another turn

The expected and current turn must match before an answer plan can be prepared. A changed turn keeps the question pending for a deliberate review.

Source: [src/lesson.ts](src/lesson.ts#L13)

```typescript
if (number(input, "expectedTurn") !== number(input, "currentTurn"))
  return report(
    "conflict",
    "The session turn changed after the question was captured",
    { state: "pending" },
    ["Recheck trusted response binding before submission"],
  );
```

### 2. Validate the question and offered option

The seeded question is q1 and only forest or wetland is supported. The returned envelope correlates that question and answer; providerSend remains not performed.

Source: [src/lesson.ts](src/lesson.ts#L14) · selected statements

```typescript
if (
  text(input, "questionId") !== "q1" ||
  !["forest", "wetland"].includes(text(input, "answer"))
)
  return report(
    "rejected",
    "Question ID or selected option is invalid",
    { state: "pending" },
    ["Require the actual user choice", "Validate the offered options"],
  );

return report(
  "passed",
  "Prepared a correlated answer for the current question",
  {
    state: "answered",
    envelope: { questionId: "q1", turn: 2, answer: text(input, "answer") },
    providerSend: "not performed",
  },
  [
    "Capture a canonical question",
    "Bind it to the session turn",
    "Claim before dispatch",
    "Reconcile uncertain delivery before another attempt",
  ],
);
```

### Check your understanding

Run **Answer the current question** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "questionId": "q1",
    "answer": "forest",
    "expectedTurn": 2,
    "currentTurn": 2
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "state": "answered"
  }
}
```

Then try **Reject a stale answer**. Its expected outcome is `conflict`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
