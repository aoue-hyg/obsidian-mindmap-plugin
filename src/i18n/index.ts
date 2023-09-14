import * as moment from "moment";
import en from "./en";
import zhCN from "./zh-cn";

const localeMap: { [k: string]: Partial<typeof zhCN> } = {
  en,
  "zh-cn": zhCN,
};

const locale = localeMap[moment.locale()];

export function t(str: keyof typeof zhCN): string {
  return (locale && locale[str]) || zhCN[str];
}