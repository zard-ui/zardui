// import { Component } from '@angular/core';
// import { By } from '@angular/platform-browser';

// import { render } from '@testing-library/angular';
// import { screen } from '@testing-library/dom';
// import { EmblaCarouselDirective } from 'embla-carousel-angular';

// import { ZardCarouselComponent } from './carousel.component';
// import { ZardCarouselModule } from './carousel.module';
// import { carouselVariants } from './carousel.variants';

// @Component({
//   selector: 'test-host',
//   imports: [ZardCarouselModule],
//   template: `
//     <z-carousel>
//       <z-carousel-content>
//         @for (n of numbers; track n) {
//           <z-carousel-item>
//             <div class="flex h-[200px] items-center justify-center text-4xl font-semibold">{{ n }}</div>
//           </z-carousel-item>
//         }
//       </z-carousel-content>
//     </z-carousel>
//   `,
// })
// class TestHostComponent {
//   protected numbers = [1, 2, 3, 4, 5];
// }

// describe('ZardCarouselComponent', () => {
//   it('should render carousel', async () => {
//     const fixture = (await render(TestHostComponent)).fixture;

//     const directive = fixture.debugElement.query(By.directive(EmblaCarouselDirective)).componentInstance;
//     expect(directive).toBeInstanceOf(ZardCarouselComponent);

//     const carouselElement = screen.getByRole('region');
//     expect(carouselElement).toBeVisible();
//     expect(carouselElement).toHaveClass(carouselVariants());
//   });

//   describe('slide buttons', () => {
//     let btnPrev: HTMLButtonElement;
//     let btnNext: HTMLButtonElement;

//     beforeEach(async () => {
//       await render(TestHostComponent);
//       btnPrev = screen.getByLabelText('Previous slide');
//       btnNext = screen.getByLabelText('Next slide');
//       screen.getByAltText('ddd');
//     });

//     it('should have slide buttons', () => {
//       expect(btnPrev).toBeVisible();
//       expect(btnNext).toBeVisible();
//       expect(btnPrev.disabled).toBeTruthy();
//       expect(btnNext.disabled).toBeFalsy();
//     });
//   });
// });
