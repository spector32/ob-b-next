import type { NextApiRequest, NextApiResponse } from "next";
import data from "./_data";

import { apiHandler } from "../../../lib/helpers/api";

function handler(req: NextApiRequest, res: NextApiResponse): void {
    const { id } = req.query as { id: number | string };
    const user = data.find((item) => item.id === id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({
            error: "User not found!",
        });
    }
}

export default apiHandler(handler);
