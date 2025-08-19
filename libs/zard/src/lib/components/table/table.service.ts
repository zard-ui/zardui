import { computed, signal } from '@angular/core';
import { TableState } from './table';

export class ZardTableService {
  private readonly state = signal<TableState>({
    pageSize: 5,
    pageIndex: 0,
    totalItems: 0,
    visibleColumns: {},
  });

  readonly hasPrevPage = computed(() => {
    const { pageIndex, first } = this.state();
    return first !== undefined ? !first : pageIndex > 0;
  });

  readonly hasNextPage = computed(() => {
    const { last, pageIndex, pageSize, totalItems } = this.state();

    return last !== undefined ? !last : (pageIndex + 1) * pageSize < totalItems;
  });

  readonly currentPage = computed(() => this.state().pageIndex + 1);

  readonly totalPages = computed(() => {
    const { totalItems, pageSize } = this.state();
    return pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;
  });

  readonly tableState = this.state.asReadonly();

  readonly visibleColumns = computed(() => this.state().visibleColumns ?? {});

  updateState(patch: Partial<TableState>): void {
    this.state.update(currentState => {
      const newPageIndex = patch.pageIndex ?? currentState.pageIndex;

      return {
        ...currentState,
        ...patch,
        pageIndex: Math.max(0, newPageIndex),
      };
    });
  }

  setInitialVisibleColumns(columns: string[]) {
    this.state.update(current => {
      if (current.visibleColumns && Object.keys(current.visibleColumns).length > 0) {
        return current;
      }

      return {
        ...current,
        visibleColumns: Object.fromEntries(columns.map(c => [c, true])),
      };
    });
  }

  toggleColumn(accessor: string) {
    this.state.update(prev => ({
      ...prev,
      visibleColumns: {
        ...(prev.visibleColumns ?? {}),
        [accessor]: !prev.visibleColumns?.[accessor],
      },
    }));
  }

  nextPage() {
    if (!this.hasNextPage()) return;
    const { pageIndex } = this.state();
    this.updateState({ pageIndex: pageIndex + 1 });
  }

  prevPage() {
    if (!this.hasPrevPage()) return;
    const { pageIndex } = this.state();
    this.updateState({ pageIndex: pageIndex - 1 });
  }

  setSorting(field: string) {
    const current = this.state();
    const direction = current.field === field && current.direction === 'asc' ? 'desc' : 'asc';

    this.updateState({ field, direction, pageIndex: 0 });
  }

  setFiltering(search: string) {
    this.updateState({ search, pageIndex: 0 });
  }

  resetPage() {
    this.updateState({ pageIndex: 0 });
  }
}
