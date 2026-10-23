# 0003. Consumer design direction

**Date:** 2026-10-23
**Status:** Proposed

## Summary

You can make the experience feel like a clear appointment preparation sheet. One question group and one next step keep the work understandable. The report follows the same reading order.

## Context

The user needs clarity, privacy and cultural sensitivity on a phone. The assessment should remain comprehensible without medical knowledge.

## Options considered

Swiss structure offers restrained hierarchy and direct report continuity. Organic offers warmer surfaces but increases texture, typography and contrast work. A dashboard or chat only design obscures the main task and is excluded by the brief.

## Decision

Propose Swiss: pure white/neutral surface, Helvetica Neue, blue #002FA7, left alignment and quiet rules. No grain, serif display, warm paper or decorative gradients. Semantic urgency colors remain a safety/accessibility exception. Implementation skill: frontend-design at `/Users/asmasalleh/.codex/skills/frontend-design/SKILL.md`, with JS Mastery architect for recorded design decisions.

Solo revision 3: implement one authored plain-language style and inline evidence, plus a complete semantic HTML report using browser print/cancel. No separate evidence portal, custom PDF engine or selective-share controls in the 82h core. The richer design alternatives remain specification context, not funded features.

## Requirements

AC-01/02/03/07/10/11/12 in the [PRD](../04-product-requirements.md) are the contract. The [design system](../06-ui-ux-design-system.md) owns tokens/components; [screen specifications](../07-screen-specifications.md) owns composition and states; [journeys](../05-user-personas-and-journeys.md) owns cultural and comprehension intent. No design source other than the user's brief and these proposed specifications is assumed approved.

## Build plan

1. Implement minimal tokens and native accessible controls after authorization, AC-01/12.
2. Build guided questions, consent and review states, AC-02/03.
3. Carry the concern/reason/next step structure into results and report, AC-07/10.
4. Verify clear, failures, keyboard, zoom, real devices and formative comprehension, AC-11/12.

## Rationale

A single aligned reading order connects concerns, reasons and next steps across the interactive result and report. This supports comprehension without requiring additional navigation or visualization.

## Consequences

The visual identity is restrained; differentiation must come from useful clarity and measured trust. No invented metrics, testimonials or clinical endorsements. Measure color contrast and actual user comprehension. The team may choose Organic before implementation; update all affected tokens rather than mixing anchors.
