import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

import { apiHandler } from "../../../lib/helpers/api";

const { serverRuntimeConfig } = getConfig();

import users from "./_data";

function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method.toUpperCase()) {
        case "POST":
            return authenticate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    function authenticate() {
        const { username, password } = req.body;
        const user = users.find((u) => u.username === username && u.password === password);

        if (!user) throw "Username or password is incorrect";

        // Create a JWT token
        const token = jwt.sign({ sessionUserId: user.id }, serverRuntimeConfig.apiSessionSecret, {
            expiresIn: serverRuntimeConfig.sessionExpirationDuration || "1d",
        });

        // return basic user details and token
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token,
        });
    }
}

export default apiHandler(handler);
