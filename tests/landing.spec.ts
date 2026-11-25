import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/es/']) {
  test(`${route} localizes the architecture content`, async ({ page }) => {
    await page.goto(route); await page.getByRole('button',{name:route==='/'?'View as list':'Ver como lista'}).click();
    await expect(page.locator('.diagram-list')).toContainText(route==='/'?'Two frontends':'Dos frontends');
    await expect(page.locator('.diagram-list')).not.toContainText(route==='/'?'Dos frontends':'Two frontends');
  });
  test(`${route} is responsive without horizontal overflow`, async ({ page }) => {
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });
  test(`${route} passes serious accessibility checks`, async ({ page }) => {
    await page.goto(route);
    for (const theme of ['light', 'dark']) {
      if (theme === 'dark') { await page.getByRole('button',{name:route==='/'?'Toggle color theme':'Cambiar tema de color'}).click(); await page.waitForTimeout(300); }
      const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      expect(results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical'), `${theme} theme`).toEqual([]);
    }
  });
}

test('journey stepper works by keyboard and highlights architecture', async ({ page }) => {
  await page.goto('/'); const second=page.locator('[data-step="1"]'); await second.focus(); await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-pressed','true'); await expect(page.locator('[data-node="checkout"]')).toHaveClass(/is-active/);
});
test('language switch keeps the current section', async ({ page }) => {
  await page.goto('/#quality'); await page.getByRole('link',{name:'ES',exact:true}).click();
  await expect(page).toHaveURL(/\/es\/#quality$/); await expect(page.locator('html')).toHaveAttribute('lang','es');
});
test('theme can be toggled and remains selected', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button',{name:'Toggle color theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark'); await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('reduced motion disables section transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' }); await page.goto('/');
  expect(await page.locator('.section').first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('1e-05s');
});
