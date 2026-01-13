import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailButton } from "./email-button";
import { EmailLayout } from "./email-layout";

interface VerificationEmailProps {
	url: string;
}

export const VerificationEmail = ({ url }: VerificationEmailProps) => (
	<EmailLayout
		preview="Verify your email address"
		tagline="Welcome to Databuddy"
	>
		<Section className="text-center">
			<Heading
				className="m-0 mb-3 font-semibold text-xl tracking-tight"
				style={{ color: "#d7d7dd" }}
			>
				Verify Your Email
			</Heading>
			<Text
				className="m-0 mb-6 text-sm leading-relaxed"
				style={{ color: "#717175" }}
			>
				Thanks for signing up! Click the button below to verify your email
				address and get started.
			</Text>
		</Section>
		<Section className="text-center">
			<EmailButton href={url}>Verify Email Address</EmailButton>
		</Section>
		<Section className="mt-8">
			<Text
				className="m-0 mb-2 text-center text-xs"
				style={{ color: "#717175" }}
			>
				This link expires in 24 hours.
			</Text>
			<Text
				className="m-0 text-center text-xs leading-relaxed"
				style={{ color: "#717175" }}
			>
				If you didn't create an account, you can safely ignore this email.
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

export default VerificationEmail;
