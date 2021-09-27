import { useTranslation } from "react-i18next";
import { i18nService } from "../../services";
// import "./LanguageMenu.scss";

export default function LanguageMenu(): JSX.Element {
    const { i18n } = useTranslation();

    return (
        <div className="language-nav">
            <nav>
                <ul>
                    {["en", "lv", "et"].map((lang) => (
                        <li key={lang} className={i18n.language === lang ? "active" : undefined}>
                            <a
                                href={`#lang-${lang}`}
                                onClick={() => {
                                    // i18n.changeLanguage(lang);
                                    i18nService.setLocale(lang);
                                }}
                            >
                                {lang}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
