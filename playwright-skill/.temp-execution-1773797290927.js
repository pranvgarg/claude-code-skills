const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // Login
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  if (!page.url().includes('/dashboard')) {
    await page.fill('input[type="text"], input[name="username"]', 'admin');
    await page.fill('input[type="password"], input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  }
  console.log('✅ Logged in');
  await page.waitForTimeout(2000);

  // Step 1: Screenshot current state — no override
  await page.screenshot({ path: '/tmp/reason-1-initial.png', fullPage: true });
  console.log('📸 Initial state: /tmp/reason-1-initial.png');

  // Step 2: Check what the WeightDisplay looks like
  console.log('\n=== WeightDisplay state ===');
  const storeState = await page.evaluate(() => {
    // Try to access Zustand store
    // Zustand stores expose getState on the hook itself
    const stores = {};
    // Check if we can find the store state
    try {
      // Look for the store in localStorage or window
      const authData = JSON.parse(localStorage.getItem('wb_auth') || '{}');
      stores.auth = authData?.state?.user;
    } catch(e) {}
    return stores;
  });
  console.log('Auth store:', JSON.stringify(storeState));

  // Step 3: Find the weight input and type a value
  const weightInput = page.locator('input[type="number"][step="0.01"]');
  const count = await weightInput.count();
  console.log(`\nFound ${count} weight input(s) with step=0.01`);

  if (count > 0) {
    // Type a weight value
    await weightInput.first().fill('15000');
    await page.waitForTimeout(500);
    console.log('Typed 15000 in weight input');

    await page.screenshot({ path: '/tmp/reason-2-weight-entered.png', fullPage: true });
    console.log('📸 After weight entry: /tmp/reason-2-weight-entered.png');
  }

  // Step 4: Check if override warning or reason input appeared
  const overrideWarning = await page.locator('text=Override').count();
  const reasonInput = await page.locator('input[placeholder*="Reason"]').count();
  console.log(`\nOverride warning visible: ${overrideWarning > 0 ? 'YES' : 'NO'}`);
  console.log(`Reason input visible: ${reasonInput > 0 ? 'YES' : 'NO'}`);

  // Step 5: Check the store values
  const weightState = await page.evaluate(() => {
    // Try to read from the DOM what the component sees
    const allInputs = document.querySelectorAll('input[type="number"]');
    const inputValues = Array.from(allInputs).map(i => ({
      placeholder: i.placeholder,
      value: i.value,
      step: i.step,
    }));
    return { inputCount: allInputs.length, inputs: inputValues };
  });
  console.log('\nAll number inputs:', JSON.stringify(weightState, null, 2));

  // Step 6: Check if isOverridden would be true
  // serialWeight is 0 (no serial connected), so isOverridden = serialWeight > 0 && ... = false
  console.log('\n=== WHY REASON BOX IS NOT SHOWING ===');
  console.log('The override reason box only shows when isOverridden is true.');
  console.log('isOverridden = serialWeight > 0 && Math.abs(parsedInput - serialWeight) > 0.01');
  console.log('Since serial is NOT connected, serialWeight = 0');
  console.log('So: 0 > 0 = false → isOverridden = false → reason box hidden');

  await browser.close();
  console.log('\n✅ Done');
})();
