import { Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';

export interface DocData {
  docName: string;
  available: boolean;
  topics: Topic[];
}

export const DOCS: DocData[] = [
  {
    docName: 'installation',
    available: true,
    topics: [
      {
        name: 'Environments',
      },
      {
        name: 'Typescript',
      },
    ],
  },
];
