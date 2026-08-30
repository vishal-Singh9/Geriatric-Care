# Geriatric Care Assessment Form

A single-page Geriatric Care Assessment Form built with React 19, TypeScript, Mantine v7, `@mantine/form`, and Zod.

## How to Run

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn dev
   ```

## How to Test

Run the full verification suite (TypeScript typechecking, Oxlint, Stylelint, Oxfmt formatting, and Vitest test suite):

```bash
yarn test
```

Or run Vitest tests directly:

```bash
yarn vitest
```

## Implementation Highlights & Schema Validation

- **Zod Schema (`src/features/assessment/schema.ts`)**:
  - `mrn`: Matches pattern `^MRN-\d{6}$`.
  - `patientName`: 2–60 characters.
  - `dateOfBirth` & `assessmentDate`: Validated with ISO date strings. Ensures patient is aged 60 or older relative to the assessment date.
  - `mobility`: Enum generated from `MOBILITY` array.
  - `barthelIndex`: Whole number between 0 and 100 in steps of 5.
  - `medicationCount`: 0 to 30.
  - `pharmacistReviewRequested`: Required if regular medication count is 5 or more (polypharmacy rule).
  - `followUpDate`: Must be strictly after the assessment date.
  - `consentObtained`: Must be `true`.
- **Single Source of Truth**: All validation rules reside exclusively in the Zod schema and are wired via `@mantine/form`'s `schemaResolver(assessmentSchema, { sync: true })`. No validation logic is duplicated in component code.
- **Submit Behavior**: Simulates an ~800ms save state, disables submit button with loading indicator, and displays parsed Zod values in a Mantine `<Code>` block upon success.
- **Sample Patient Fixture**: Features a "Load sample patient" button populating valid test data.

## Unit & Integration Testing

1. **Schema Boundary Test**: Tests exact 60-year age boundary on assessment date (`safeParse`) for exact 60 vs 1 day short.
2. **Form Submission Test**: Renders form with MantineProvider, clicks "Load sample patient", submits form, and asserts `onSave` handler is called with parsed Zod values.

## Anything Unfinished

Everything specified in the assignment prompt is **100% complete** and all verification checks (`yarn test`) are passing cleanly.

## Time Spent

Approximately 1.5 hours spent on setup, schema implementation, form component building, test coverage, and documentation.
# Geriatric-Care
