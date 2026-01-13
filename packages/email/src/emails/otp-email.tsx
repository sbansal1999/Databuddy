import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "./email-layout";

interface OtpEmailProps {
	otp: string;
}

export const OtpEmail = ({ otp }: OtpEmailProps) => (
	<EmailLayout preview="Your verification code" tagline="Verification Code">
		<Section className="text-center">
			<Heading
				className="m-0 mb-3 font-semibold text-xl tracking-tight"
				style={{ color: "#d7d7dd" }}
			>
				Your One-Time Code
			</Heading>
			<Text
				className="m-0 mb-6 text-sm leading-relaxed"
				style={{ color: "#717175" }}
			>
				Enter this code to complete your sign-in. Do not share this code with
				anyone.
			</Text>
		</Section>
		<Section className="text-center">
			<Text
				className="m-0 inline-block rounded px-8 py-4 font-bold font-mono text-2xl"
				style={{
					backgroundColor: "#111114",
					border: "1px solid #28282c",
					color: "#d7d7dd",
					letterSpacing: "0.3em",
				}}
			>
				{otp}
			</Text>
		</Section>
		<Section className="mt-8">
			<Text
				className="m-0 mb-2 text-center text-xs"
				style={{ color: "#717175" }}
			>
				This code expires in 10 minutes.
			</Text>
			<Text
				className="m-0 text-center text-xs leading-relaxed"
				style={{ color: "#717175" }}
			>
				If you didn't request this code, someone may be trying to access your
				account. Please secure your account immediately.
			</Text>
		</Section>
	</EmailLayout>
);

export default OtpEmail;
