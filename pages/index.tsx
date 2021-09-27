import { useEffect } from "react";
// import Head from "next/head";
import { useTranslation } from "react-i18next";
import Layout from "../lib/layouts/default";
// import styles from "../lib/assets/styles/Home.module.css";
import testSound from "../lib/assets/audio/payout-award-test.wav";
import { useStore } from "../lib/stores";
import SoundButton from "../lib/components/molecular/SoundButton";
import { observer } from "mobx-react-lite";

const envIndicatior: string = process.env.NODE_ENV !== "production" ? `(${process.env.NODE_ENV})` : "";

function IndexPage() {
    const { t } = useTranslation();
    const { users, app } = useStore();

    console.log("Testing");

    useEffect(() => {
        if (!users.totalUsers) {
            users.get();
        }
    }, [users]);

    return (
        <Layout>
            <div>
                {users.isLoading ? <h1>SERVICE HOOK IS WORKING!</h1> : undefined}
                {t("welcome")} ENV - {envIndicatior} <br />
                <h2>{app.isAuthenticated ? "AUTHENTICATED" : " NOT AUTHENTICATED"}</h2>
            </div>
            <div>
                <SoundButton audioFile={testSound} />
            </div>
            <div>
                <ul>
                    {users.isLoading ? (
                        <li>Loading...</li>
                    ) : (
                        users.data.map((u) => (
                            <li key={u.id}>
                                {u.name} ({u.email})
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </Layout>
    );
}

export default observer(IndexPage);

export async function getServerSideProps(): Promise<Record<string, unknown>> {
    return {
        props: {
            test: "test prop",
        },
    };
}
