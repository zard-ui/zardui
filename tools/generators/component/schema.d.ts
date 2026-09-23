export type ComponentCategory =
  | 'Form & Input'
  | 'Layout & Navigation'
  | 'Overlays & Dialogs'
  | 'Feedback & Status'
  | 'Display & Media'
  | 'Misc';

export interface ComponentGeneratorSchema {
  name: string;
  description: string;
  category?: ComponentCategory;
}
