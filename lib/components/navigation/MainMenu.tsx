import { useRouter } from "next/router";
import Link from "next/link";
import { useStore } from "../../stores";
// import "./MainMenu.scss";

export default function MainMenu(): JSX.Element {
    const { route }: { route: string } = useRouter();
    const { app } = useStore();

    // console.log("router: ", router);

    const menuItems = [
        {
            title: "Home (welcome page)",
            link: "/",
        },
        {
            title: "Non existant route",
            link: "/non-existing-route",
        },
        {
            title: "Private route",
            link: "/private",
        },
        {
            title: "Private route (with redirect)",
            link: "/private-redirect",
        },
    ];

    return (
        <nav className="main-nav">
            <ul>
                {menuItems.map(({ title, link }: { title: string; link: string }, index: number) => (
                    <li key={`${index}-${link}`} className={link === route ? "active" : undefined}>
                        <Link href={link}>{title}</Link>
                    </li>
                ))}
                {app.isAuthenticated && (
                    <li>
                        <a href="#logout" onClick={() => app.logout()}>
                            Log out
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
}
