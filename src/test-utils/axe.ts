import axe from 'axe-core'

/**
 * Runs axe on a rendered fragment and fails with the list of violated rules.
 * `color-contrast` needs real layout (jsdom has none); `region` is a page-level
 * rule that always fires on isolated fragments.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  })
  const problems = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} node(s))`)
  if (problems.length > 0) {
    throw new Error(`axe found ${problems.length} a11y violation(s):\n${problems.join('\n')}`)
  }
}
