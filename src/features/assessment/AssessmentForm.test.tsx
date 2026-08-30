import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { AssessmentForm } from './AssessmentForm';
import { assessmentSchema } from './schema';

describe('Schema Boundary', () => {
  it('accepts exactly 60', () => {
    const result = assessmentSchema.safeParse({
      mrn: 'MRN-004821',
      patientName: 'Test Patient',
      dateOfBirth: '1966-08-07',
      assessmentDate: '2026-08-07',
      mobility: 'independent',
      barthelIndex: 100,
      medicationCount: 0,
      pharmacistReviewRequested: false,
      followUpDate: '2026-08-08',
      consentObtained: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects one day short of 60', () => {
    const result = assessmentSchema.safeParse({
      mrn: 'MRN-004821',
      patientName: 'Test Patient',
      dateOfBirth: '1966-08-08',
      assessmentDate: '2026-08-07',
      mobility: 'independent',
      barthelIndex: 100,
      medicationCount: 0,
      pharmacistReviewRequested: false,
      followUpDate: '2026-08-08',
      consentObtained: true,
    });
    expect(result.success).toBe(false);
  });
});

describe('AssessmentForm Submission', () => {
  it('calls save handler with parsed values on submit', async () => {
    const handleSave = vi.fn();
    render(
      <MantineProvider>
        <AssessmentForm onSave={handleSave} saveDelayMs={0} />
      </MantineProvider>
    );

    const loadButton = screen.getByRole('button', { name: /Load sample patient/i });
    fireEvent.click(loadButton);

    const submitButton = screen.getByRole('button', { name: /Save Assessment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledTimes(1);
    });

    expect(handleSave).toHaveBeenCalledWith({
      mrn: 'MRN-004821',
      patientName: 'Sushila Deshpande',
      dateOfBirth: '1949-03-12',
      assessmentDate: '2026-08-07',
      mobility: 'cane',
      barthelIndex: 80,
      medicationCount: 3,
      pharmacistReviewRequested: false,
      followUpDate: '2026-09-04',
      consentObtained: true,
    });
  });
});
