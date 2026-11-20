import { PresetHistory } from './preset-history';

describe('PresetHistory', () => {
  it('starts with nothing to undo or redo', () => {
    const history = new PresetHistory('A');

    expect(history.canUndo).toBe(false);
    expect(history.canRedo).toBe(false);
    expect(history.undo()).toBeNull();
    expect(history.redo()).toBeNull();
  });

  it('records each new code and walks back and forth exactly', () => {
    const history = new PresetHistory('A');
    history.observe('B');
    history.observe('C');

    expect(history.undo()).toBe('B');
    history.observe('B');
    expect(history.undo()).toBe('A');
    history.observe('A');
    expect(history.canUndo).toBe(false);

    expect(history.redo()).toBe('B');
    history.observe('B');
    expect(history.redo()).toBe('C');
    history.observe('C');
    expect(history.canRedo).toBe(false);
  });

  it('does not record the code an undo caused as a new entry', () => {
    const history = new PresetHistory('A');
    history.observe('B');
    history.undo();
    history.observe('A');

    expect(history.canRedo).toBe(true);
    expect(history.current).toBe('A');
  });

  it('ignores a repeat of the current code', () => {
    const history = new PresetHistory('A');
    history.observe('A');

    expect(history.canUndo).toBe(false);
  });

  it('drops the redo branch when a new code arrives after an undo', () => {
    const history = new PresetHistory('A');
    history.observe('B');
    history.observe('C');
    history.undo();
    history.observe('B');
    history.observe('D');

    expect(history.canRedo).toBe(false);
    expect(history.undo()).toBe('B');
    history.observe('B');
    expect(history.undo()).toBe('A');
  });
});
