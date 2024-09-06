import puppeteer, { Page } from "puppeteer-core";
import { getOptions } from "./options";
import { FileType } from "./types";

let _page: Page | null = null;

async function getPage(isDev: boolean) {
  if (_page) {
    return _page;
  }

  const options = await getOptions(isDev);

  try {
    const browser = await puppeteer.launch(options);
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
  type: FileType,
  isDev: boolean
) {
  const page = await getPage(isDev);
  try {
    await page.setViewport({ width, height });
    await page.setContent(html);
    const file = await page.screenshot({ type });
    return file;
  } catch (error) {
    console.error("Failed to generate screenshot", error);
    throw error;
  }
}
