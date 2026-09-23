import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideCircleCheck,
  lucideColumns3,
  lucideEllipsisVertical,
  lucideGripVertical,
  lucideLoader,
  lucidePlus,
} from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardTableImports } from '@zard/components/table/table.imports';
import { tabButtonVariants, tabNavVariants } from '@zard/components/tabs/tabs.variants';

export interface Dashboard01Row {
  readonly id: number;
  readonly header: string;
  readonly type: string;
  readonly status: 'Done' | 'In Process';
  readonly target: string;
  readonly limit: string;
  readonly reviewer: string;
}

type ColumnKey = 'type' | 'status' | 'target' | 'limit' | 'reviewer';

const SECTION_TYPES = ['Narrative', 'Technical content', 'Legal', 'Financial', 'Capabilities'];
const REVIEWERS = ['Eddie Lake', 'Jamik Tashpulatov', 'Emily Whalen', ''];

/** Titles of the first rows, matching the shadcn sample document. */
const HEADERS = [
  'Cover page',
  'Table of contents',
  'Executive summary',
  'Technical approach',
  'Design',
  'Capabilities',
  'Integration with existing systems',
  'Innovation and Advantages',
  "Overview of EMR's Innovative Solutions",
  'Advanced Algorithms and Machine Learning',
  'Adaptive Communication Protocols',
  'Advantages Over Current Technologies',
  'Past Performance',
  'Customer Feedback and Satisfaction Levels',
  'Implementation Challenges and Solutions',
  'Return on Investment (ROI) Analysis',
  'Competitive Analysis',
  'Risk Assessment and Mitigation Strategies',
  'Compliance and Regulatory Requirements',
  'Scalability and Future Growth Projections',
  'Cost-Benefit Analysis',
  'User Training and Onboarding Plan',
  'Data Security and Privacy Measures',
  'Integration Timeline and Milestones',
  'Maintenance and Support Framework',
  'Performance Metrics and KPIs',
  'Stakeholder Communication Plan',
  'Change Management Strategy',
  'Quality Assurance Procedures',
  'Disaster Recovery Planning',
  'Vendor Management Approach',
  'Resource Allocation Model',
  'Technical Documentation Standards',
  'Testing and Validation Protocols',
];

@Component({
  selector: 'lib-dashboard-01-data-table',
  standalone: true,
  imports: [
    ...ZardTableImports,
    ...ZardDropdownImports,
    ...ZardSelectImports,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardCheckboxComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
    NgIcon,
  ],
  viewProviders: [
    provideIcons({
      lucideChevronDown,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
      lucideCircleCheck,
      lucideColumns3,
      lucideEllipsisVertical,
      lucideGripVertical,
      lucideLoader,
      lucidePlus,
    }),
  ],
  templateUrl: './dashboard-01-data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Dashboard01DataTableComponent {
  protected readonly navClasses = tabNavVariants({ zVariant: 'default' });
  protected readonly buttonClasses = tabButtonVariants();

  protected readonly tabs = [
    { value: 'outline', label: 'Outline', badge: '' },
    { value: 'past-performance', label: 'Past Performance', badge: '3' },
    { value: 'key-personnel', label: 'Key Personnel', badge: '2' },
    { value: 'focus-documents', label: 'Focus Documents', badge: '' },
  ];

  protected readonly activeTab = signal('outline');

  protected readonly columns: { key: ColumnKey; label: string }[] = [
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'target', label: 'Target' },
    { key: 'limit', label: 'Limit' },
    { key: 'reviewer', label: 'Reviewer' },
  ];

  protected readonly hiddenColumns = signal<ReadonlySet<ColumnKey>>(new Set());

  // This is sample data.
  protected readonly rows = signal<Dashboard01Row[]>(
    Array.from({ length: 68 }, (_, index) => ({
      id: index + 1,
      header: HEADERS[index % HEADERS.length],
      type:
        index === 0 ? 'Cover page' : index === 1 ? 'Table of contents' : SECTION_TYPES[index % SECTION_TYPES.length],
      status: index % 3 === 0 ? ('In Process' as const) : ('Done' as const),
      target: `${((index * 7) % 30) + 1}`,
      limit: `${((index * 11) % 30) + 1}`,
      reviewer: REVIEWERS[index % REVIEWERS.length],
    })),
  );

  protected readonly selected = signal<ReadonlySet<number>>(new Set());

  protected readonly pageSizes = ['10', '20', '30', '40', '50'];
  protected readonly pageSize = signal('10');
  protected readonly pageIndex = signal(0);

  protected readonly pageCount = computed(() => Math.ceil(this.rows().length / Number(this.pageSize())));

  protected readonly pageRows = computed(() => {
    const size = Number(this.pageSize());
    const start = this.pageIndex() * size;
    return this.rows().slice(start, start + size);
  });

  protected readonly allPageRowsSelected = computed(() => {
    const page = this.pageRows();
    const selected = this.selected();
    return page.length > 0 && page.every(row => selected.has(row.id));
  });

  protected isVisible(column: ColumnKey): boolean {
    return !this.hiddenColumns().has(column);
  }

  protected toggleColumn(column: ColumnKey, visible: boolean): void {
    this.hiddenColumns.update(columns => {
      const next = new Set(columns);
      if (visible) {
        next.delete(column);
      } else {
        next.add(column);
      }
      return next;
    });
  }

  protected isSelected(row: Dashboard01Row): boolean {
    return this.selected().has(row.id);
  }

  protected toggleRow(row: Dashboard01Row, checked: boolean): void {
    this.selected.update(selected => {
      const next = new Set(selected);
      if (checked) {
        next.add(row.id);
      } else {
        next.delete(row.id);
      }
      return next;
    });
  }

  protected toggleAllOnPage(checked: boolean): void {
    this.selected.update(selected => {
      const next = new Set(selected);
      for (const row of this.pageRows()) {
        if (checked) {
          next.add(row.id);
        } else {
          next.delete(row.id);
        }
      }
      return next;
    });
  }

  protected onPageSizeChange(size: string | string[]): void {
    if (typeof size !== 'string' || !size) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
  }

  protected goToPage(index: number): void {
    this.pageIndex.set(Math.min(Math.max(index, 0), this.pageCount() - 1));
  }

  /** Reordering is scoped to the current page, which is the slice the user can actually see. */
  protected onRowDrop(event: CdkDragDrop<Dashboard01Row[]>): void {
    const offset = this.pageIndex() * Number(this.pageSize());
    this.rows.update(rows => {
      const next = [...rows];
      moveItemInArray(next, offset + event.previousIndex, offset + event.currentIndex);
      return next;
    });
  }
}
