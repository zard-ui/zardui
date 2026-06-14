export function isInputElement(target: EventTarget | null): target is HTMLInputElement {
  return target instanceof HTMLInputElement;
}

export function isInputEvent(event: Event): event is InputEvent {
  return event instanceof InputEvent;
}
