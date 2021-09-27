import { getLocationOrigin as serverOrigin } from "next/dist/next-server/lib/utils";

export default function getLocationOrigin(): string {
    if (typeof window !== "undefined" && window) {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? ":" + port : ""}`;
    } else {
        return serverOrigin();
    }
}
