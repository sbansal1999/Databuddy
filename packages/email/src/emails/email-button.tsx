import { Button } from "@react-email/components";

interface EmailButtonProps {
	href: string;
	children: React.ReactNode;
}

export const EmailButton = ({ href, children }: EmailButtonProps) => (
	<Button
		className="rounded bg-brand px-6 py-3 text-center font-semibold text-sm text-white"
		href={href}
		style={{ backgroundColor: "#3030ed" }}
	>
		{children}
	</Button>
);
