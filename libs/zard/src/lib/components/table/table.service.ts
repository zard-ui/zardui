import { computed, signal } from '@angular/core';
import { TableState } from './table';

export class ZardTableService {
  private readonly state = signal<TableState>({
    pageSize: 10,
    pageIndex: 0,
    totalItems: 0,
  });

  readonly hasPrevPage = computed(() => {
    const { pageIndex, first } = this.state();
    return first !== undefined ? !first : pageIndex > 0;
  });

  readonly hasNextPage = computed(() => {
    const { last, pageIndex, pageSize, totalItems } = this.state();

    return last !== undefined ? !last : (pageIndex + 1) * pageSize < totalItems;
  });

  readonly tableState = this.state.asReadonly();

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

  nextPage() {
    if (!this.hasNextPage()) return;
    this.state.update(currentState => ({
      ...currentState,
      pageIndex: currentState.pageIndex + 1,
    }));
  }

  prevPage() {
    if (!this.hasPrevPage()) return;
    this.state.update(currentState => ({
      ...currentState,
      pageIndex: currentState.pageIndex - 1,
    }));
  }

  resetPage() {
    this.state.update(state => ({ ...state, pageIndex: 0 }));
  }
}
