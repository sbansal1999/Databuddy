import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailButton } from "./email-button";
import { EmailLayout } from "./email-layout";

interface ResetPasswordEmailProps {
	url: string;
}

export const ResetPasswordEmail = ({ url }: ResetPasswordEmailProps) => (
	<EmailLayout preview="Reset your password" tagline="Password Reset">
		<Section className="text-center">
			<Heading
				className="m-0 mb-3 font-semibold text-xl tracking-tight"
				style={{ color: "#d7d7dd" }}
			>
				Reset Your Password
			</Heading>
			<Text
				className="m-0 mb-6 text-sm leading-relaxed"
				style={{ color: "#717175" }}
			>
				We received a request to reset your password. Click the button below to
				choose a new one.
			</Text>
		</Section>
		<Section className="text-center">
			<EmailButton href={url}>Reset Password</EmailButton>
		</Section>
		<Section className="mt-8">
			<Text
				className="m-0 mb-2 text-center text-xs"
				style={{ color: "#717175" }}
			>
				This link expires in 1 hour for security reasons.
			</Text>
			<Text
				className="m-0 text-center text-xs leading-relaxed"
				style={{ color: "#717175" }}
			>
				If you didn't request a password reset, please ignore this email or
				contact support if you're concerned about your account security.
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

export default ResetPasswordEmail;
