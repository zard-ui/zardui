import { render } from '@testing-library/angular';
import { ShellLayout } from './shell.layout';

const setup = async () => {
  return await render(ShellLayout);
};

describe('ShellLayout', () => {
  it('should render', async () => {
    await setup();
  });
});
