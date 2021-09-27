import jwt from "express-jwt";
import util from "util";
import getConfig from "next/config";
import { NextApiRequest, NextApiResponse } from "next";

const { serverRuntimeConfig } = getConfig();

function jwtMiddleware(req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> {
    if (!serverRuntimeConfig.apiSessionSecret) {
        throw new Error("API_SESSION_SECRET is not set!");
    }
    const middleware = jwt({
        secret: serverRuntimeConfig.apiSessionSecret,
        algorithms: ["HS256"],
        strict: false,
        getToken: function fromHeaderOrQuerystring(req: NextApiRequest): string | string[] | null {
            // Token extraction from request headers
            console.log("req.query: ", req.query);
            if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
    }).unless({
        // Public routes that don't require authentication
        path: ["/api/users/auth"],
    });

    return util.promisify(middleware)(req, res);
}

export { jwtMiddleware };
