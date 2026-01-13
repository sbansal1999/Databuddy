import { Section, Text } from "@react-email/components";

interface EmailHeaderProps {
	tagline?: string;
}

export const EmailHeader = ({ tagline }: EmailHeaderProps) => (
	<Section className="pt-8 pb-6 text-center">
		<table align="center" cellPadding={0} cellSpacing={0}>
			<tr>
				<td align="center">
					<svg
						fill="none"
						height="40"
						viewBox="0 0 600 600"
						width="40"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Databuddy</title>
						<path
							d="M305 290C305 292.761 307.239 295 310 295H395C397.761 295 400 297.239 400 300V395C400 397.761 397.761 400 395 400H300C297.239 400 295 397.761 295 395V310C295 307.239 292.761 305 290 305H205C202.239 305 200 302.761 200 300V205C200 202.239 202.239 200 205 200H300C302.761 200 305 202.239 305 205V290Z"
							fill="#d7d7dd"
						/>
						<path
							clipRule="evenodd"
							d="M600 495C600 497.761 597.761 500 595 500H505C502.239 500 500 502.239 500 505V595C500 597.761 497.761 600 495 600H5C2.23857 600 0 597.761 0 595V5C0 2.23857 2.23858 0 5 0H495C497.761 0 500 2.23858 500 5V95C500 97.7614 502.239 100 505 100H595C597.761 100 600 102.239 600 105V495ZM110 100C107.239 100 105 102.239 105 105V495C105 497.761 107.239 500 110 500H490C492.761 500 495 497.761 495 495V105C495 102.239 492.761 100 490 100H110Z"
							fill="#d7d7dd"
							fillRule="evenodd"
						/>
					</svg>
				</td>
			</tr>
		</table>
		<Text
			className="mt-3 mb-0 font-semibold text-foreground text-sm tracking-wide"
			style={{ color: "#d7d7dd" }}
		>
			Databuddy
		</Text>
		{tagline ? (
			<Text
				className="mt-1 mb-0 text-muted text-xs"
				style={{ color: "#717175" }}
			>
				{tagline}
			</Text>
		) : null}
	</Section>
);
