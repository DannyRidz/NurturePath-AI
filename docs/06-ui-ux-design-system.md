# UI and design system proposal

Design source: the user's brief and the installed Frontend Design skill, with no existing design file or application to preserve. This document specifies design; it does not implement components. Consumer clarity takes precedence over visual novelty.

Problem in one sentence: a person who feels uncertain about reproductive health needs a discreet, comprehensible next step without a dashboard, medical score or long form.

## Two distinct directions

| Direction | Visual system | Strength and cost |
|---|---|---|
| **A, Swiss appointment sheet, recommended** | Pure white/neutral surface, Helvetica Neue throughout, blue accent #002FA7, left aligned composition and hairline section rules | Clear hierarchy, familiar reading, useful report continuity; must avoid cold institutional wording |
| B, Organic private guide | Sand #E8DCC7, sage #8B9D83, moss #606C38, Epilogue, 16 to 32px corners, 1% subtle grain | Warmer, tactile feel; more palette/texture and contrast work, less direct report aesthetic |

These are separate anchors, not a hybrid. A has no warm paper, serif headings, decorative grain or centered hero. B has no pure white/black, cold grey or square cards; body text would use dark olive #293226 and require contrast verification. Choose A for this deadline. Avoid imagery, faux clinical seals, stock doctors, AI sparkles and invented testimonials.

Signature move: a single appointment sheet connects “What you told us,” “Why it may matter,” and “Your next step” through consistent aligned rows. The same structure becomes the report, so sharing feels like a continuation rather than a new system.

## Recommended tokens

| Area | Specification and rationale |
|---|---|
| Surfaces | #FFFFFF primary; #F7F7F8 secondary; #D4D4D8 rules; no gradients, glass or decorative shadows |
| Text | #18181B primary; #52525B secondary; color pairs measured during implementation |
| Accent | #002FA7 for primary action, links and progress marker; white button text |
| Safety | #9F1239 with explicit “Urgent” text and icon; #854D0E for “Review needed.” Semantic safety hues are a documented accessibility exception to a single decorative accent |
| Type | Helvetica Neue, Helvetica, Arial, sans-serif. One family, no remote font request. Body 18px/1.55; supporting copy minimum 16px; h1 32px mobile/44px wide, h2 26/32, labels 18 semibold |
| Spacing | 4px base, use 4/8/12/16/24/32/48/64. Heading to explanation 12; question to choices 24; sections 32 |
| Shape | 1px borders, 4px controls, 8px maximum quiet containers. Selected answers use border and check icon, not color alone |
| Width | Question column max 42rem; results/report max 48rem; landing max 72rem. Body line length roughly 55 to 75 characters |
| Breakpoints | 0 to 639px single column with 20px gutter; 640 to 1023px 32px gutter; 1024px+ landing two columns if useful, assessment remains one reading column |
| Navigation | Wordmark, optional Back, Hide screen, Finish and clear. No sidebar, account avatar or dashboard navigation |
| Icons | One established outline icon set with accessible text labels; no Unicode stand ins, no icon only urgent meaning |
| Motion | 120 to 180ms opacity/focus transitions only; no autoplay, parallax, breathing effects or progress celebration. Respect reduced motion |

## Components and states

| Component | Normal and interaction | Failure/accessibility behavior |
|---|---|---|
| Primary button | Plain verb, 48px minimum height, clear hover/pressed treatment | Text remains descriptive when loading; disable only duplicate submission, not Back/clear |
| Secondary/link button | Outline or underlined action, same hit area | Never low contrast “Continue without AI” |
| Answer choice | Full width labelled radio/checkbox group with generous padding | fieldset/legend, keyboard operation, selected check and border |
| Input | Persistent label, optional helper, no placeholder only label | Error tied through describedby, preserve answer, focus error summary |
| Progress | “Section 2 of 5: Your concerns” | Derived from fixed sections; no time estimate until measured |
| Evidence card | Source title, organization, edition/date, simple explanation | Missing source/clinical approval prevents model selection, authored simulation remains |
| Result section | One next step above secondary education | Explicit uncertainty, no low/medium/high fertility badge |
| Urgent panel | First heading and action, text plus icon and border | role alert once when triggered, no repeated screen reader announcements |
| Dialog | Clear action purpose, initial focus and cancel | Focus trapped, Escape works, returns to origin. No consent in unavoidable modal |
| Loading | Static result visible while optional approved fragment selection loads | After deadline show authored explanation and retry, no infinite spinner |
| Empty | “No assessment is open. Start a fictional scenario.” | No fake data or sample metrics posing as results |
| Success | “Your session has been cleared on this device.” | State download/provider limits nearby; no medical congratulations |

## Accessibility and responsive behavior

Target WCAG 2.2 AA: normal text contrast 4.5:1, large text 3:1, meaningful controls/focus 3:1. These are standards targets, not measured claims. Provide visible 3px blue focus with a contrasting separation ring; do not obscure it under sticky controls. Minimum design touch target is 44 by 44px, usually 48px, exceeding the AA minimum where practical. Do not encode meaning solely with hue, position or icon.

Use semantic headings, landmarks, skip link, fieldset/legend, native controls and predictable tab order. After Next focus the new question heading; on error focus summary then allow field links. Avoid announcing entire screens. Sticky mobile action row is allowed only if content and focus remain unobscured at zoom and with virtual keyboard. Prefer flow layout if that fails.

At 320 CSS px no sideways scroll. Verify 200% text and 400% browser zoom, landscape, VoiceOver/Safari and keyboard. Results and report must remain comprehensible without animation, color, icons or network fonts. No dark mode before core contrast and reader checks pass.

## Copy rules

Use “Your next step,” “Why we ask,” “I don't know,” “Prefer not to answer,” “Review answers,” and “Finish and clear.” Avoid “AI risk classification,” “fertility optimization score,” “diagnosis,” “all clear,” and “100% private.” Use only labels that convey actual information. All example patient facts must be visibly fictional. Do not advertise a completion time until observed task times justify a qualified estimate.
