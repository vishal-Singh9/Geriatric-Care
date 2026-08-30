import dayjs from 'dayjs';
import { useState } from 'react';
import {
  TextInput,
  Select,
  NumberInput,
  Checkbox,
  Button,
  Container,
  Paper,
  Title,
  Alert,
  Code,
  Stack,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, schemaResolver } from '@mantine/form';
import { assessmentSchema, Assessment, MOBILITY } from './schema';

interface AssessmentFormProps {
  onSave?: (data: Assessment) => void;
  saveDelayMs?: number;
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function AssessmentForm({ onSave, saveDelayMs = 800 }: AssessmentFormProps = {}) {
  const [isSaving, setIsSaving] = useState(false);
  const [successData, setSuccessData] = useState<Assessment | null>(null);

  const form = useForm({
    initialValues: {
      mrn: '',
      patientName: '',
      dateOfBirth: '',
      assessmentDate: '',
      mobility: '',
      barthelIndex: '' as unknown as number,
      medicationCount: '' as unknown as number,
      pharmacistReviewRequested: false,
      followUpDate: '',
      consentObtained: false,
    },
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSaving(true);
    setSuccessData(null);
    try {
      const parsed = assessmentSchema.parse(values);
      if (saveDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, saveDelayMs));
      }
      onSave?.(parsed);
      setSuccessData(parsed);
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  const loadSamplePatient = () => {
    form.setValues({
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
    setSuccessData(null);
  };

  const mobilityOptions = MOBILITY.map((val) => ({
    value: val,
    label: val.charAt(0).toUpperCase() + val.slice(1),
  }));

  const maxDateStr = dayjs().format('YYYY-MM-DD');

  return (
    <Container size="sm" py="xl">
      <Paper shadow="xs" p="xl" withBorder>
        <Title order={1} mb="lg">
          Geriatric Care Assessment
        </Title>
        <Button variant="light" mb="xl" onClick={loadSamplePatient}>
          Load sample patient
        </Button>

        {successData && (
          <Alert title="Success" color="green" mb="xl">
            Assessment saved successfully!
            <Code block mt="md">
              {JSON.stringify(successData, null, 2)}
            </Code>
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              key={form.key('mrn')}
              {...form.getInputProps('mrn')}
            />

            <TextInput
              label="Patient name"
              placeholder="Full name"
              key={form.key('patientName')}
              {...form.getInputProps('patientName')}
            />

            <DateInput
              label="Date of birth"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              leftSection={<CalendarIcon />}
              clearable
              popoverProps={{ shadow: 'md', position: 'bottom-start' }}
              key={form.key('dateOfBirth')}
              {...form.getInputProps('dateOfBirth')}
            />

            <DateInput
              label="Assessment date"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              leftSection={<CalendarIcon />}
              clearable
              maxDate={maxDateStr as unknown as Date}
              popoverProps={{ shadow: 'md', position: 'bottom-start' }}
              key={form.key('assessmentDate')}
              {...form.getInputProps('assessmentDate')}
            />

            <Select
              label="Mobility"
              placeholder="Select status"
              data={mobilityOptions}
              key={form.key('mobility')}
              {...form.getInputProps('mobility')}
            />

            <NumberInput
              label="Barthel Index"
              placeholder="0 - 100 (steps of 5)"
              step={5}
              clampBehavior="none"
              key={form.key('barthelIndex')}
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              placeholder="0 - 30"
              clampBehavior="none"
              key={form.key('medicationCount')}
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              key={form.key('pharmacistReviewRequested')}
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />

            <DateInput
              label="Next review date"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              leftSection={<CalendarIcon />}
              clearable
              popoverProps={{ shadow: 'md', position: 'bottom-start' }}
              key={form.key('followUpDate')}
              {...form.getInputProps('followUpDate')}
            />

            <Checkbox
              label="Patient or representative has given consent"
              key={form.key('consentObtained')}
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Button type="submit" loading={isSaving} mt="md">
              Save Assessment
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
