import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Router } from "next/router";
import { i18nService } from "../lib/services";
import ServiceManager, { StoreProvider } from "../lib/stores";
import { resources } from "../lib/locales";
import getLocationOrigin from "../lib/helpers/getLocationOrigin";
import "../lib/assets/scss/index.scss";
import { useTranslation } from "react-i18next";

i18nService.init({
    resources,
    interpolation: {
        // format: function (value: any, format: any, lng: string) {
        //     // if (value instanceof Date) return moment(value).format(format);
        //     return value;
        // },
    },
});

type EntryComponentProps = {
    Component: React.FunctionComponent;
    pageProps: Record<string, unknown> | undefined;
    router: Router;
    other?: unknown;
};

function EntryComponent({ Component, pageProps, router: nextRouter }: EntryComponentProps): JSX.Element {
    const { app, routing } = ServiceManager;
    if (!routing.router) routing.setRouter(nextRouter);
    console.log("routing.activeRoutePath: ", routing.activeRoutePath);
    const { t } = useTranslation();
    const [isAllowed, setIsAllowed] = useState(false); // app.isAuthenticated

    const hideContent = () => {
        if (isAllowed) {
            setIsAllowed(false);
        }
    };

    // console.log("nextRouter: ", nextRouter);
    /*

    router.render().when(true);

    */

    const authCheck = (url: string) => {
        // console.log("Do check");
        // Redirect to login page if accessing a private page and not logged in
        const publicPaths = ["/auth"];
        // If ssr doesn't work with this - use `url.split("?")[0]` instead
        const urlObject: URL = new URL(url, getLocationOrigin());
        if (!app.isAuthenticated && !publicPaths.includes(urlObject.pathname)) {
            hideContent();
            if (urlObject.pathname !== "/auth") {
                nextRouter.push({
                    pathname: "/auth",
                    query: { r: nextRouter.asPath },
                });
            }
        } else {
            setIsAllowed(true);
        }
    };

    useEffect(() => {
        // Run auth check on initial load
        authCheck(nextRouter.asPath);

        // Set authorized to false to hide page content while changing routes
        nextRouter.events.on("routeChangeStart", hideContent);

        // Run auth check on route change
        nextRouter.events.on("routeChangeComplete", authCheck);

        // Unsubscribe from events in useEffect return function
        return () => {
            // console.log("Does this happen?");
            nextRouter.events.off("routeChangeStart", hideContent);
            nextRouter.events.off("routeChangeComplete", authCheck);
        };
    }, [authCheck, nextRouter]);

    return (
        <StoreProvider storeManager={ServiceManager}>
            {!app.isReady ? (
                <div className="loader">{t("Loading...")}</div>
            ) : (
                (isAllowed && <Component {...pageProps} />) || <div className="not-allowed">Not allowed!</div>
            )}
        </StoreProvider>
    );
}

const Entry: React.FunctionComponent = observer<EntryComponentProps>(EntryComponent);

export default function App(appProps: unknown): JSX.Element {
    return <Entry {...appProps} />;
}
