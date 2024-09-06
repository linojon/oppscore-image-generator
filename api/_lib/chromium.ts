import chromium from "chrome-aws-lambda";
import puppeteer, { Browser, Page, ScreenshotOptions } from "puppeteer-core";

let _page: Page | null = null;

async function getPage(isDev: boolean): Promise<Page> {
  if (isDev) console.log('isDev is set');
  
  if (_page) {
    return _page;
  }

  const options = {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath || puppeteer.executablePath(),
    headless: chromium.headless,
  };

  try {
    const browser: Browser = await puppeteer.launch(options);
    _page = await browser.newPage();
    return _page;
  } catch (error) {
    console.error("Failed to launch the browser or open a new page", error);
    throw new Error("Browser launch failed");
  }
}

export async function getScreenshot(
  width: number,
  height: number,
  html: string,
  type: ScreenshotOptions["type"],
  isDev: boolean
): Promise<Buffer> {
  const page = await getPage(isDev);
  try {
    await page.setViewport({ width, height });
    await page.setContent(html);
    
    // Explicitly type the return value as Buffer
    const file: Buffer = await page.screenshot({ type }) as Buffer;
    
    return file;
  } catch (error) {
    console.error("Failed to generate screenshot", error);
    throw error;
  }
}
