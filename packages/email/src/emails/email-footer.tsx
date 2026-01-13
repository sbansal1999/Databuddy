import { Hr, Link, Section, Text } from "@react-email/components";

export const EmailFooter = () => (
	<Section className="mt-8">
		<Hr style={{ borderColor: "#28282c" }} />
		<Text className="m-0 mb-2 text-center text-xs" style={{ color: "#717175" }}>
			<Link
				href="https://www.databuddy.cc"
				style={{ color: "#717175", textDecoration: "underline" }}
			>
				Website
			</Link>
			{" · "}
			<Link
				href="https://www.databuddy.cc/docs"
				style={{ color: "#717175", textDecoration: "underline" }}
			>
				Docs
			</Link>
			{" · "}
			<Link
				href="https://twitter.com/trydatabuddy"
				style={{ color: "#717175", textDecoration: "underline" }}
			>
				Twitter
			</Link>
		</Text>
		<Text className="m-0 text-center text-xs" style={{ color: "#717175" }}>
			© {new Date().getFullYear()} Databuddy, Inc. All rights reserved.
		</Text>
	</Section>
);
