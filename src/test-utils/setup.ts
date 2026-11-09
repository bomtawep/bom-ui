import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest globals are off, so Testing Library cannot register its own cleanup.
afterEach(() => {
  cleanup()
})

// jsdom lacks these; Radix primitives call them (positioning, pointer capture, scrolling).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
}
if (typeof Element.prototype.hasPointerCapture !== 'function') {
  Element.prototype.hasPointerCapture = () => false
}
if (typeof Element.prototype.releasePointerCapture !== 'function') {
  Element.prototype.releasePointerCapture = () => {}
}
if (typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {}
}

// Sidebar (useIsMobile) and Radix read matchMedia; jsdom lacks it.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
// Radix Select/Menu open on pointerdown and check PointerEvent fields.
if (typeof window.PointerEvent !== 'function') {
  class PointerEventStub extends MouseEvent {
    pointerId: number
    pointerType: string
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
      this.pointerType = init.pointerType ?? 'mouse'
    }
  }
  window.PointerEvent = PointerEventStub as unknown as typeof PointerEvent
}
