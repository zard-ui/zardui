import { buttonVariants } from './button.variants';
import { toggleVariants } from '../toggle/toggle.variants';
import { toggleGroupItemVariants } from '../toggle-group/toggle-group.variants';

describe('direction-aware variants', () => {
  const physical = /(^|[\s:])(pl|pr|ml|mr|border-l|border-r|rounded-l|rounded-r|text-left|text-right)(-|\s|$)/;

  it('button uses logical icon paddings', () => {
    const classes = buttonVariants({ zSize: 'default' });
    expect(classes).toContain('has-data-[icon=inline-start]:ps-2');
    expect(classes).toContain('has-data-[icon=inline-end]:pe-2');
    expect(classes).not.toMatch(physical);
  });

  it('toggle uses logical icon paddings', () => {
    const classes = toggleVariants({ zSize: 'default' });
    expect(classes).not.toMatch(physical);
    expect(classes).toContain('has-data-[icon=inline-start]:ps-2');
  });

  it('toggle-group item joins borders with logical classes', () => {
    const classes = toggleGroupItemVariants();
    expect(classes).toContain('first:border-s');
    expect(classes).not.toContain('ltr:');
    expect(classes).not.toMatch(physical);
  });
});
