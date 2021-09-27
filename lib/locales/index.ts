import en from "./en/translations";
import et from "./et/translations";
import lv from "./lv/translations";

const getTranslations = (locales: any) => {
  const translationObject: any = {};
  for (const localeKey in locales) {
    translationObject[localeKey] = {
      translation: locales[localeKey],
    };
  }
  return translationObject;
};

const resources = getTranslations({ en, et, lv });

export { resources };
