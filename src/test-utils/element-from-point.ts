// input-otp probes the page with document.elementFromPoint (password-manager badge detection); jsdom lacks it.
// Import only in InputOTP tests: defining it globally changes how axe judges focusable elements.
if (typeof document.elementFromPoint !== 'function') {
  document.elementFromPoint = () => null
}
