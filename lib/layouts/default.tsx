import Head from "next/head";
import LanguageMenu from "../components/navigation/LanguageMenu";
import MainMenu from "../components/navigation/MainMenu";

export default function DefaultLayout({
    pageTitle,
    children,
}: {
    pageTitle?: string;
    children: JSX.Element | JSX.Element[] | undefined;
}): JSX.Element {
    return (
        <>
            {pageTitle && (
                <Head>
                    <title>{pageTitle}</title>
                </Head>
            )}
            <div className="layout default-layout">
                <header>
                    <div className="header">
                        <LanguageMenu />
                        <MainMenu />
                    </div>
                </header>
                {children}
                <footer>
                    <h4>This is default layout</h4>
                </footer>
            </div>
        </>
    );
}
