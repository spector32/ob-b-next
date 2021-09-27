import { useTranslation } from "react-i18next";
import Layout from "../lib/layouts/default";

export default function Page404(): JSX.Element {
    const { t } = useTranslation();

    return (
        <Layout>
            <div>404 - {t("not found")}</div>
        </Layout>
    );
}
