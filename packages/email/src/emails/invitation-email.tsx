import { Heading, Link, Section, Text } from "@react-email/components";
import { sanitizeEmailText } from "../utils/sanitize";
import { EmailButton } from "./email-button";
import { EmailLayout } from "./email-layout";

interface InvitationEmailProps {
	inviterName: string;
	organizationName: string;
	invitationLink: string;
}

export const InvitationEmail = ({
	inviterName,
	organizationName,
	invitationLink,
}: InvitationEmailProps) => {
	const safeOrganizationName = sanitizeEmailText(organizationName) || "a team";
	const safeInviterName = sanitizeEmailText(inviterName) || "A team member";

	return (
		<EmailLayout
			preview={`Join ${safeOrganizationName} on Databuddy`}
			tagline="Team Invitation"
		>
			<Section className="text-center">
				<Heading
					className="m-0 mb-3 font-semibold text-xl tracking-tight"
					style={{ color: "#d7d7dd" }}
				>
					You're Invited!
				</Heading>
				<Text
					className="m-0 mb-6 text-sm leading-relaxed"
					style={{ color: "#717175" }}
				>
					<span style={{ color: "#d7d7dd", fontWeight: 500 }}>
						{safeInviterName}
					</span>{" "}
					has invited you to join{" "}
					<span style={{ color: "#d7d7dd", fontWeight: 500 }}>
						{safeOrganizationName}
					</span>{" "}
					on Databuddy.
				</Text>
			</Section>
			<Section className="text-center">
				<EmailButton href={invitationLink}>Accept Invitation</EmailButton>
			</Section>
			<Section className="mt-8">
				<Text
					className="m-0 mb-2 text-center text-xs"
					style={{ color: "#717175" }}
				>
					This invitation expires in 48 hours.
				</Text>
				<Text
					className="m-0 text-center text-xs leading-relaxed"
					style={{ color: "#717175" }}
				>
					If you weren't expecting this invitation, you can safely ignore this
					email.
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
					href={invitationLink}
					style={{ color: "#3030ed", wordBreak: "break-all" }}
				>
					{invitationLink}
				</Link>
			</Section>
		</EmailLayout>
	);
};

export default InvitationEmail;
