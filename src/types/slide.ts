export interface SlideOption {
  label: string;
  value: string;
  action: 'proceed' | 'navigate' | 'update_spreadsheet' | 'lookup_services';
  nextSlide?: string;
}

export interface Slide {
  id: string;
  title: string;
  prompt: string;
  options: SlideOption[];
}

export interface SlideNavigationState {
  currentSlide: string;
  history: string[];
  data: Record<string, string | boolean | number>;
}
