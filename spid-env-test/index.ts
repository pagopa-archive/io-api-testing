import { tryCatch, taskEitherSeq, fromEither, fromLeft } from "fp-ts/lib/TaskEither";
import { toError, left, Either, right } from "fp-ts/lib/Either";
import { array } from "fp-ts/lib/Array";

import { Page, Browser, launch } from "puppeteer";
import pageInteractions from "./page-interactions";
const readToken = (page: Page): Either<Error, string> => {
  const href = page.url();
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
  const loginUrl = `${host}/login?entityID=xx_testenv2&authLevel=SpidL2`;

  let br: Browser, pg: Page;

  const closeBrowser = tryCatch(async () => {
        console.log('closing browser')
        await br.close();
      }, toError)

  return tryCatch(
    () => launch({ headless: true, devtools: true, ignoreHTTPSErrors: true }),
    toError
  )
    .chain(browser => {
      br = browser;
      return tryCatch(() => browser.pages(), toError);
    })
    .chain(([page]) => {
      pg = page;
      return tryCatch(async () => pageInteractions(page), toError);
    })
    .chain(({ goTo, text, click, wait /*, waitUntilUrl */ }) =>
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
    )
    .chain(() => {
      return fromEither(readToken(pg));
    })
    .foldTaskEither<Error, string>(
      error => closeBrowser.foldTaskEither<Error, string>(
        _ => fromLeft(error),
        _ => fromLeft(error)
      ),
      token => closeBrowser.map(_ => token)
    );
};
