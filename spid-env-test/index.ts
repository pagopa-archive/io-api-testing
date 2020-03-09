import {
  tryCatch,
  taskEitherSeq,
  fromEither,
  TaskEither,
  fromLeft,
  left as leftTE
} from "fp-ts/lib/TaskEither";
import { toError, fromNullable, left, Either, right } from "fp-ts/lib/Either";
import { array } from "fp-ts/lib/Array";
import { task } from "fp-ts/lib/Task";

import { Page, Browser, launch } from "puppeteer";
import pageInteractions from "./page-interactions";

const SPID_LOGIN_HOST = "https://app-backend.dev.io.italia.it";
const USERNAME = "alice.rossi";
const PASSWORD = "io-app-test";

const readToken = (page: Page): Either<Error, string> => {
  const href = page.url();
  console.log("href", href);
  const index = href.indexOf("?");
  if (index < 0) return left(new Error(href));
  return right(href.substring(index + 1).split("=")[1]);
};

type SpidCredentials = {
  username: string;
  password: string;
};

type SpidTestEnv = {
  host: string;
};

export type LoginLevel1Params = SpidTestEnv & SpidCredentials;

export const loginLevel1 = ({
  host,
  username,
  password
}: LoginLevel1Params) => {
  const loginUrl = `${host}/login?entityID=xx_testenv2&authLevel=SpidL1`;

  let br: Browser, pg: Page;

  /*  const browser = await puppeteer.launch({ headless: true, devtools: true });
    const page = await browser.newPage();

    const { goTo, text, click, wait, waitUntilUrl } = pageInteractions(page); */

  const browserTE = tryCatch(() => {
    console.warn("+++ browser launch");
    return launch({ headless: false, devtools: true });
  }, toError);
  const pageTE = browserTE.chain(browser => {
    br = browser;
    return tryCatch(() => browser.newPage(), toError);
  });
  const inter = pageTE.chain(page => {
    pg = page;
    return tryCatch(async () => pageInteractions(page), toError);
  });

  const RobotTE = inter.chain(({ goTo, text, click, wait, waitUntilUrl }) =>
    array.sequence(taskEitherSeq)([
      goTo(loginUrl),
      text("#username", username),
      text("#password", password),
      click('button[type="submit"][name="confirm"]'),
      wait(100),
      click('button[type="submit"][name="confirm"]'),
      //waitUntilUrl("?token=")
      wait(3000)
    ])
  );

  //   const tokenTE = RobotTE.chain(() => fromEither(readToken(page)));
  const tokenTE = RobotTE.chain(() => {
    console.warn("+++ page");
    return fromEither(readToken(pg));
  }).chain(token =>
    tryCatch(async () => {
      console.log('close browser')
      await br.close();
      console.log('token', token)
      return token;
    }, toError)
  )

  /*     const token = array
      .sequence(taskEitherSeq)([
        goTo(loginUrl),
        text("#username", username),
        text("#password", password),
        click('button[type="submit"][name="confirm"]'),
        wait(100),
        click('button[type="submit"][name="confirm"]'),
        waitUntilUrl("?token=")
      ])
      .chain(() => fromEither(readToken(page)));

    await browser.close(); */



  return tokenTE;
};
