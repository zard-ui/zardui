import { provideRouter } from '@angular/router';

import { render } from '@testing-library/angular';

import { DocumentationLayout } from './documentation.layout';

const setup = async () => {
  return await render(DocumentationLayout, { providers: [provideRouter([])] });
};

describe('DocumentationLayout', () => {
  it('should render', async () => {
    await setup();
  });
});
