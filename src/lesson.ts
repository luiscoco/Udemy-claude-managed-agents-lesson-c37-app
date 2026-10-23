import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 37,
  title: "Host Questions and Correlated Answers",
  description: "Suppose an agent asks whether a habitat report should focus on wetlands or forests. A useful host must show that question to the correct user and carry the answer back to the correct conversation.",
  concepts: ["Questions need correlation", "A current turn binding can expire", "Actual user selection precedes send"],
  scope: "Captures and answers a local host question. It does not send a provider user.message. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Answer the current question", "input": {"questionId": "q1", "answer": "forest", "expectedTurn": 2, "currentTurn": 2}, "expected": "passed", "checks": {"state": "answered"}}, {"id": "1", "label": "Reject a stale answer", "input": {"questionId": "q1", "answer": "forest", "expectedTurn": 1, "currentTurn": 2}, "expected": "conflict", "checks": {"state": "pending"}}, {"id": "2", "label": "Reject an unoffered choice", "input": {"questionId": "q1", "answer": "desert", "expectedTurn": 2, "currentTurn": 2}, "expected": "rejected", "checks": {"state": "pending"}}],
  async run(input) {

if(number(input,"expectedTurn")!==number(input,"currentTurn"))return report("conflict","The session turn changed after the question was captured",{state:"pending"},["Recheck trusted response binding before submission"]);
if(text(input,"questionId")!=="q1"||!["forest","wetland"].includes(text(input,"answer")))return report("rejected","Question ID or selected option is invalid",{state:"pending"},["Require the actual user choice","Validate the offered options"]);
return report("passed","Prepared a correlated answer for the current question",{state:"answered",envelope:{questionId:"q1",turn:2,answer:text(input,"answer")},providerSend:"not performed"},["Capture a canonical question","Bind it to the session turn","Claim before dispatch","Reconcile uncertain delivery before another attempt"]);

  }
};
