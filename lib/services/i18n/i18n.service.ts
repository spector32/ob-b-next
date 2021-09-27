import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

class Internationalization {
  i18nInstance: any;

  constructor() {
    this.i18nInstance = i18n.use(LanguageDetector).use(initReactI18next);
  }

  init(options: object) {
    if (!this.i18nInstance) {
      throw Error("i18n onject is not set!");
    }
    this.i18nInstance.init(options);
  }

  setLocale(locale: string) {
    this.i18nInstance.changeLanguage(locale);
  }

  get instance() {
    return this.i18nInstance;
  }

  get activeLocale() {
    return this.i18nInstance.language;
  }
}

export default new Internationalization();

// USAGE in components:
// export const ExampleComponent = () => {
//   const { t } = useTranslation();

//   return (
//     <div>
//       <p>{t("welcome")}</p>
//     </div>
//   );
// };
