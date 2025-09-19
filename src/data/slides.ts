import { Slide } from '@/types/slide';

export const slides: Record<string, Slide> = {
  dynatraceOnboarding: {
    id: 'dynatraceOnboarding',
    title: 'Dynatrace Service Onboarding',
    prompt: 'Is the Dynatrace service onboarded in PagerDuty?',
    options: [
      {
        label: 'Yes',
        value: 'yes',
        action: 'proceed',
      },
      {
        label: 'No',
        value: 'no',
        action: 'navigate',
        nextSlide: 'technicalServiceCheck',
      },
    ],
  },
  technicalServiceCheck: {
    id: 'technicalServiceCheck',
    title: 'Technical Service Check',
    prompt: 'Does the technical service exist in PagerDuty?',
    options: [
      {
        label: 'Yes',
        value: 'yes',
        action: 'lookup_services',
      },
      {
        label: 'No',
        value: 'no',
        action: 'update_spreadsheet',
      },
    ],
  },
  onboardingSteps: {
    id: 'onboardingSteps',
    title: 'Dynatrace Service Onboarding Steps',
    prompt: 'Proceed with onboarding steps for the Dynatrace service.',
    options: [
      {
        label: 'Start Onboarding Process',
        value: 'start',
        action: 'proceed',
      },
    ],
  },
};
