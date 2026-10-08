const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function loginApi(identifier, password) {
  const res = await fetch('http://localhost:4000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed for ${identifier}: ${res.status} ${text}`);
  }
  return await res.json();
}

async function run() {
  console.log('🚀 Authenticating demo accounts via API...');
  const customerAuth = await loginApi('customer@foodhub.in', 'FoodHub@2026');
  const ownerAuth = await loginApi('owner@foodhub.in', 'FoodHub@2026');
  const courierAuth = await loginApi('courier@foodhub.in', 'FoodHub@2026');

  console.log('🌐 Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Helper to set localStorage auth
  async function setAuth(authData) {
    await page.evaluate((auth) => {
      if (auth) {
        localStorage.setItem(
          'foodhub_auth',
          JSON.stringify({
            state: {
              user: auth.user,
              accessToken: auth.accessToken,
              isAuthenticated: true,
              lastActiveTime: Date.now(),
              showTimeoutWarning: false,
            },
            version: 0,
          })
        );
      } else {
        localStorage.removeItem('foodhub_auth');
      }
    }, authData);
  }

  // ==========================================
  // 1. Img 01: Landing Page
  // ==========================================
  console.log('📸 1/9: Capturing Img 01: Landing Page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 01 - Landing Page.png'),
  });

  // ==========================================
  // 2. Img 02: Login and OTP Verification
  // ==========================================
  console.log('📸 2/9: Capturing Img 02: Login and OTP Verification...');
  await page.goto('http://localhost:5173/account', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // Click "Sign in with OTP (Mobile)"
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Sign in with OTP')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // Focus and type phone number into input
  const phoneInput = await page.$('input');
  if (phoneInput) {
    await phoneInput.click();
    await phoneInput.type('9820044444', { delay: 40 });
  }
  await new Promise((r) => setTimeout(r, 500));

  // Click "Send 6-Digit OTP"
  const buttonsAfterPhone = await page.$$('button');
  for (const btn of buttonsAfterPhone) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Send 6-Digit OTP')) {
      await btn.click();
      break;
    }
  }
  // Wait for OTP input boxes and Dev OTP chip to render
  await new Promise((r) => setTimeout(r, 2000));

  // Type sample digits into OTP inputs
  const otpInputs = await page.$$('input[type="text"]');
  if (otpInputs.length >= 3) {
    await otpInputs[0].type('6');
    await otpInputs[1].type('7');
    await otpInputs[2].type('3');
  }
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 02 - Login and OTP Verification.png'),
  });

  // ==========================================
  // 3. Img 03: Home – Restaurant Discovery
  // ==========================================
  console.log('📸 3/9: Capturing Img 03: Home – Restaurant Discovery...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(() => {
    window.scrollTo({ top: 620, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 03 - Home Restaurant Discovery.png'),
  });

  // ==========================================
  // 4. Img 04: Restaurant Menu Page
  // ==========================================
  console.log('📸 4/9: Capturing Img 04: Restaurant Menu Page...');
  await page.goto('http://localhost:5173/restaurant/bombay-canteen-co', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 04 - Restaurant Menu Page.png'),
  });

  // ==========================================
  // 5. Img 05: Cart and Checkout
  // ==========================================
  console.log('📸 5/9: Capturing Img 05: Cart and Checkout...');
  await setAuth(customerAuth);
  // Populate cart store in localStorage
  await page.evaluate(() => {
    const cartState = {
      state: {
        restaurantId: '74f51f72-dacd-48d1-b2e6-0e293ab1b3d5',
        restaurantName: 'Bombay Canteen & Co.',
        restaurantMinOrder: 200,
        items: [
          {
            id: 'cart_demo_1',
            menuItemId: '4f8006e2-2dfd-4c11-ba4e-8661b55f6f07',
            restaurantId: '74f51f72-dacd-48d1-b2e6-0e293ab1b3d5',
            name: 'Arbi Tuk Chaat',
            price: 360,
            unitPriceWithDelta: 360,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
            isVeg: true,
          },
          {
            id: 'cart_demo_2',
            menuItemId: '697a5307-7ef5-492d-ac5f-fa77ec88f230',
            restaurantId: '74f51f72-dacd-48d1-b2e6-0e293ab1b3d5',
            name: 'Cochin Spiced Calamari',
            price: 490,
            unitPriceWithDelta: 490,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
            isVeg: false,
          },
        ],
        appliedCoupon: 'WELCOME50',
        isDrawerOpen: false,
      },
      version: 0,
    };
    localStorage.setItem('foodhub_cart', JSON.stringify(cartState));
  });
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 05 - Cart and Checkout.png'),
  });

  // ==========================================
  // 6. Img 06: Live Order Tracking
  // ==========================================
  console.log('📸 6/9: Capturing Img 06: Live Order Tracking...');
  await setAuth(customerAuth);
  const activeOrderId = '41753ef9-c15a-4f0a-93d1-e80c12ddfd31';
  await page.goto(`http://localhost:5173/orders/${activeOrderId}/track`, { waitUntil: 'networkidle2' });
  // Wait for map tiles and markers to load smoothly
  await new Promise((r) => setTimeout(r, 3000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 06 - Live Order Tracking.png'),
  });

  // ==========================================
  // 7. Img 07: Restaurant Dashboard – Live Orders
  // ==========================================
  console.log('📸 7/9: Capturing Img 07: Restaurant Dashboard – Live Orders...');
  await setAuth(ownerAuth);
  await page.goto('http://localhost:5173/restaurant', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 07 - Restaurant Dashboard Live Orders.png'),
  });

  // ==========================================
  // 8. Img 08: Delivery Partner App
  // ==========================================
  console.log('📸 8/9: Capturing Img 08: Delivery Partner App...');
  await setAuth(courierAuth);
  await page.goto('http://localhost:5173/courier', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 08 - Delivery Partner App.png'),
  });

  // ==========================================
  // 9. Img 09: Order History and Reviews
  // ==========================================
  console.log('📸 9/9: Capturing Img 09: Order History and Reviews...');
  await setAuth(customerAuth);
  await page.goto('http://localhost:5173/orders', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'Img 09 - Order History and Reviews.png'),
  });

  await browser.close();
  console.log('✨ All 9 screenshots generated and verified in:', OUTPUT_DIR);
}

run().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
