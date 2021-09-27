import { ReactElement, ReactHTMLElement } from "react";

// import "./Button.scss";

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    label?: JSX.Element | string;
    children?: JSX.Element | JSX.Element[] | unknown;
};

export default function Button({
    label,
    type,
    children,
    ...otherProps
}: ButtonProps): ReactElement<ReactHTMLElement<HTMLButtonElement>> {
    // TODO: More custom magic here

    return (
        <button {...otherProps} type={type}>
            {label || children}
        </button>
    );
}
