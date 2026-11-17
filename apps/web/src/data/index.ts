import { i18n } from "../i18n";
import type { Messages } from "./messages";

/**
 * The site's copy in the language being shown: `DATA.hero.status` reads from the English or
 * the Indonesian messages (see messages.ts), whichever vue-i18n is set to. Read in a template,
 * it follows a change of language by itself.
 */
export const DATA = new Proxy({} as Messages, {
  get: (_, section: string) =>
    (i18n.global.messages.value[i18n.global.locale.value] as Record<string, unknown>)[section],
});
