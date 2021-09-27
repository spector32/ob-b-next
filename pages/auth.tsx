import { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useStore } from "../lib/stores";
import Layout from "../lib/layouts/default";
import AuthCredentials from "../lib/types/AuthCredentials.type";

function LoginPage() {
    const router = useRouter();
    const { app } = useStore();
    const { t } = useTranslation();

    // console.log("app.isAuthenticated: ", app.isAuthenticated);
    // if (app.isAuthenticated) {
    //     router.push("/");
    // }
    useEffect(() => {
        // Redirect to home if already logged in
        console.log("app.isAuthenticated in EFFECT: ", app.isAuthenticated);
        if (app.isAuthenticated) {
            router.push("/");
        }
    }, []);

    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string().required(t("Username is required")).email(t("Invalid email")),
        password: Yup.string().required(t("Password is required")),
    });

    function onSubmit(credentials: AuthCredentials) {
        const { email, password } = credentials;

        return app
            .login({ email, password })
            .then(() => {
                // get return url from query parameters or default to '/'
                const returnUrl = router.query.r ? router.query.r.toString() : "/";
                router.push(returnUrl);
            })
            .catch((error) => {
                // setError("apiError", { message: error });
                console.log("error: ", error);
            });
    }

    return (
        <Layout pageTitle={t("User authentication")}>
            <div>
                <h1>{app.isAuthenticated ? "AUTH" : "NO AUTH"}</h1>
            </div>
            <Formik
                onSubmit={onSubmit}
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={validationSchema}
            >
                {({ errors, touched, isValidating }) => (
                    <Form>
                        <Field name="email" />
                        {errors.email && touched.email && <div className="error">{errors.email}</div>}

                        <Field name="password" type="password" />
                        {errors.password && touched.password && <div className="error">{errors.password}</div>}

                        <button type="submit" disabled={isValidating}>
                            Authenticate
                        </button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default observer(LoginPage);
