import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailButton } from "./email-button";
import { EmailLayout } from "./email-layout";

interface MagicLinkEmailProps {
	url: string;
}

export const MagicLinkEmail = ({ url }: MagicLinkEmailProps) => (
	<EmailLayout
		preview="Your magic link to sign in"
		tagline="Sign in to Databuddy"
	>
		<Section className="text-center">
			<Heading
				className="m-0 mb-3 font-semibold text-xl tracking-tight"
				style={{ color: "#d7d7dd" }}
			>
				Your Magic Link
			</Heading>
			<Text
				className="m-0 mb-6 text-sm leading-relaxed"
				style={{ color: "#717175" }}
			>
				Click the button below to securely sign in to your account. No password
				needed.
			</Text>
		</Section>
		<Section className="text-center">
			<EmailButton href={url}>Sign In to Databuddy</EmailButton>
		</Section>
		<Section className="mt-8">
			<Text
				className="m-0 mb-2 text-center text-xs"
				style={{ color: "#717175" }}
			>
				This link expires in 24 hours and can only be used once.
			</Text>
			<Text
				className="m-0 text-center text-xs leading-relaxed"
				style={{ color: "#717175" }}
			>
				If you didn't request this, you can safely ignore this email.
			</Text>
		</Section>
		<Section
			className="mt-6 rounded p-4"
			style={{ backgroundColor: "#111114" }}
		>
			<Text className="m-0 mb-2 text-xs" style={{ color: "#717175" }}>
				Having trouble with the button? Copy and paste this link:
			</Text>
			<Link
				className="text-xs underline"
				href={url}
				style={{ color: "#3030ed", wordBreak: "break-all" }}
			>
				{url}
			</Link>
		</Section>
	</EmailLayout>
);

export default MagicLinkEmail;
