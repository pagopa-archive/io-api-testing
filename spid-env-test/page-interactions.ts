import { tryCatch, TaskEither } from "fp-ts/lib/TaskEither";
import { toError, right, left } from "fp-ts/lib/Either";
import { Page } from "puppeteer";

export type PageInteractions = {
  goTo: (url: string) => TaskEither<Error, void>;
  text: (selector: string, val: string) => TaskEither<Error, void>;
  waitUntilUrl: (selector: string, timeout?: number) => TaskEither<Error, void>;
  wait: (time: number) => TaskEither<Error, void>;
  click: (selector: string) => TaskEither<Error, void>;
};

const checkValue = async (selector: string, val: string) => {
  const obj: HTMLInputElement | null = document.querySelector(selector);
  if (obj && obj.value && obj.value.toLowerCase() == val.toLowerCase()) return;
  throw new Error();
};

const pageInteractions = (page: Page): PageInteractions => {
  const goTo = (url: string) =>
    tryCatch(
      () =>
        page.goto(url, { waitUntil: "load", timeout: 100000 }).then(() => {}),
      toError
    );

  const text = (selector: string, val: string) =>
    tryCatch(async () => {
      await page.waitForSelector(selector, { timeout: 300000 });
      await page.focus(selector);
      await page.keyboard.type(val, { delay: 7 });
      await page.evaluate(checkValue, selector, val);
      await page.waitFor(10);
    }, toError);

  const wait = (time: number) =>
    tryCatch(() => page.waitFor(time).then(() => {}), toError);

  const waitUntilUrl = (urlPattern: string, timeout = 100000) => {
    const matcher = () => ~page.url().indexOf(urlPattern);
    const delay = () => new Promise(ok => setTimeout(ok, 200));
    return tryCatch(async () => {
      const endtime = Date.now() + timeout;
      while (Date.now() <= endtime) {
        if (matcher()) return;
        await delay();
      }
      throw new Error("timeout");
    }, toError);
  };

  const click = (selector: string) =>
    tryCatch(async () => {
      await page.waitForSelector(selector, { timeout: 3000 });
      await page.click(selector);
      await page.waitFor(10);
    }, toError);

  return {
    text,
    click,
    goTo,
    wait,
    waitUntilUrl
  };
};

export default pageInteractions;
