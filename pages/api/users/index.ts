import type { NextApiRequest, NextApiResponse } from "next";
import data from "./_data";

import { apiHandler } from "../../../lib/helpers/api";

function handler(_req: NextApiRequest, res: NextApiResponse) {
    // Return list of users
    return res.status(200).json(data);
}

export default apiHandler(handler);
