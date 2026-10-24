# NurturePath design

Source: docs/06-ui-ux-design-system.md and ADR 0003.

Character: a Swiss appointment sheet, with a quiet white surface, one sans family, blue actions and visible rules. The aligned numbered rows connect context, reason and next step. No decorative imagery or remote fonts.

## Build mandate

Keep one clear reading column through the journey. Use plain actions, visible fictional labels and honest review status. Carry the same reading order into future reports. Preserve keyboard focus, generous touch targets and readable text at narrow widths.

Tokens and responsive rules live in src/app/globals.css. Native controls supply radio and checkbox semantics. No dark mode is included in this first slice, consistent with the design specification.
