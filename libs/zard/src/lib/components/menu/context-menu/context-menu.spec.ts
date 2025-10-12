import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardMenuModule } from '@zard/components/menu/menu.module';
import { ZardDemoContextMenuComponent } from '@zard/components/menu/context-menu/demo/default';

describe('SimpleContextMenuComponent', () => {
  let component: ZardDemoContextMenuComponent;
  let fixture: ComponentFixture<ZardDemoContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ZardMenuModule,
        ZardDemoContextMenuComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDemoContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir canPaste à false par défaut', () => {
    expect(component.canPaste).toBeFalsy();
  });

  it('devrait déclencher onMenuOpen lors du clic droit', () => {
    const spy = jest.spyOn(component, 'onMenuOpen');
    const divElement = fixture.nativeElement.querySelector('div[z-context-menu]');

    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true
    });
    divElement.dispatchEvent(contextMenuEvent);

    expect(spy).toHaveBeenCalled();
  });

  describe('Actions du menu', () => {
    it('devrait appeler la méthode copy()', () => {
      const spy = jest.spyOn(console, 'log');
      component.copy();
      expect(spy).toHaveBeenCalledWith('Copier');
    });

    it('devrait appeler la méthode paste()', () => {
      const spy = jest.spyOn(console, 'log');
      component.paste();
      expect(spy).toHaveBeenCalledWith('Coller');
    });

    it('devrait appeler la méthode delete()', () => {
      const spy = jest.spyOn(console, 'log');
      component.delete();
      expect(spy).toHaveBeenCalledWith('Supprimer');
    });
  });

  it('devrait logger lors de la fermeture du menu', () => {
    const spy = jest.spyOn(console, 'log');
    component.onMenuClose();
    expect(spy).toHaveBeenCalledWith('Menu fermé');
  });
});
