import {
	Body,
	Container,
	Head,
	Html,
	Preview,
	Section,
	Tailwind,
} from "@react-email/components";
import { EmailFooter } from "./email-footer";
import { EmailHeader } from "./email-header";

interface EmailLayoutProps {
	preview: string;
	tagline?: string;
	children: React.ReactNode;
}

export const EmailLayout = ({
	preview,
	tagline,
	children,
}: EmailLayoutProps) => (
	<Html>
		<Head>
			<meta content="width=device-width, initial-scale=1.0" name="viewport" />
		</Head>
		<Preview>{preview}</Preview>
		<Tailwind
			config={{
				theme: {
					extend: {
						colors: {
							brand: "#3030ed",
							background: "#111114",
							card: "#1a1a1d",
							foreground: "#d7d7dd",
							"card-foreground": "#d7d7dd",
							border: "#28282c",
							muted: "#717175",
							"muted-foreground": "#717175",
						},
					},
				},
			}}
		>
			<Body className="m-0 bg-background font-sans">
				<Container className="mx-auto my-10 max-w-[520px] px-4">
					<EmailHeader tagline={tagline} />
					<Section
						className="rounded bg-card px-8 py-6"
						style={{ border: "1px solid #28282c" }}
					>
						{children}
					</Section>
					<EmailFooter />
				</Container>
			</Body>
		</Tailwind>
	</Html>
);
