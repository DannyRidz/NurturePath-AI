# NurturePath AI

**A working prototype that helps adults prepare for a first conversation about male reproductive health.** Explore a fictional concern, see what next step the app illustrates and why, and prepare something to discuss with a clinician.

**[Open the live prototype](https://nurturepath-demo.vercel.app)** · No account required · Use fictional details only

Built by **J2D - Health** for the Future Health Digital Innovation Challenge, **Fertility / Male Reproductive Health**. Jeremiah Ewande led the team and produced the demo video. Daniel Ridzwan Bin Mohamad developed the app.

## Try the prototype

1. Select **Explore a fictional example**, choose **General learning**, and review the notice.
2. Follow the fictional case to **Your next step**. Read the reasons and source links, then select **Preview complete report**. Use your browser to print or save the report if you want a copy.
3. On the guidance screen, choose **Help me prepare for a conversation** for three optional Gemini discussion questions, or **Practise with Gemini** to try up to two rounds of wording feedback. Read the separate Google consent notice and use invented wording only. You can select questions from the practice exercise for a separate preparation sheet.
4. To see how the app handles urgency, choose the fictional example **Sudden severe pain**. The app interrupts the journey and shows authored safety guidance immediately. Use **Finish and clear** to end the session.

The twelve examples demonstrate how the experience handles general learning, different concerns, and uncertain answers. The prototype is for education and appointment preparation. It cannot assess your fertility, diagnose a condition, or arrange care.

## What Gemini does

Written guidance, its reasons, and the complete report come from the fictional case and work without AI. Gemini is optional and available on **General learning** subject to service availability and region. In the question tool, the summary stays fixed to the example and Gemini drafts only the three questions. In wording practice, you preview what will be sent, then choose whether to send it for feedback. Gemini does not set the care direction.

There is no personal health intake or patient account. The current journey lives in browser memory. **Finish and clear** removes that session from the app. Printed or saved copies and information already sent to Google remain outside that control. See [Privacy and limits](https://nurturepath-demo.vercel.app/privacy) for the details.

## What we verified

- Browser checks covered the twelve fictional outcomes, safety interruption, report preview and printing, and session clearing across desktop and mobile browser configurations. See [scenario navigation checks](docs/scenario-navigation-verification.md) and [report checks](docs/report-verification.md).
- Hosted verification completed two real Gemini wording practice rounds with invented text, checked the preparation sheet and clearing, and confirmed that the shared shutdown blocked new requests. See the [hosted verification record](docs/rehearsal-tester-operations.md).
- The fixed General learning question tool produced 20 structurally valid drafts in 20 frozen evaluation calls. The calls used the same fictional input and returned the same question set. See the [Gemini evaluation](docs/gemini-live-evaluation.md).

Jeremiah’s feedback was informal prototype feedback. Clinical usefulness, patient outcomes, and performance across populations still need evaluation. A clinical pilot would require qualified review and a care partner.

## Run locally

The app uses Next.js, React, TypeScript, Tailwind CSS and Zod. The hosted prototype runs on Vercel, with server-side Gemini requests and shared Redis controls. You can run the written journey locally without Gemini credentials.

Use Node.js 20.19 or newer. CI uses Node.js 22.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium webkit firefox
npm run test:e2e
```

If a restricted local environment prevents Turbopack from binding its compiler port, use `npm run build -- --webpack`. See the [project plan](docs/MASTER-PLAN.md) and [production coach operations](docs/production-coach-operations.md) for design and deployment details.
