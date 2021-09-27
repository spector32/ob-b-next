import { useTranslation } from "react-i18next";
import Layout from "../lib/layouts/default";

export default function PrivatePage(): JSX.Element {
    const { t } = useTranslation();

    return (
        <Layout>
            <div>This is private page / {t("welcome")}</div>
        </Layout>
    );
}
