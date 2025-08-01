'use client';

import { useAtom } from 'jotai';
import React, { Suspense } from 'react';
import { cn } from '@/lib/utils';
import {
	currentMessageAtom,
	messagesAtom,
} from '@/stores/jotai/assistantAtoms';
import type { Message } from '../types/message';
import ChatSection, { ChatSkeleton } from './chat-section';
import VisualizationSection, {
	VisualizationSkeleton,
} from './visualization-section';

export default function AIAssistantMain() {
	const [messages] = useAtom(messagesAtom);
	const [, setCurrentMessage] = useAtom(currentMessageAtom);

	const latestVisualizationMessage = messages
		.slice()
		.reverse()
		.find(
			(m: Message) =>
				m.data &&
				m.chartType &&
				m.type === 'assistant' &&
				m.responseType === 'chart'
		);

	let currentQueryMessage: Message | undefined;
	if (latestVisualizationMessage) {
		const vizMessageIndex = messages.findIndex(
			(m) => m.id === latestVisualizationMessage.id
		);
		if (vizMessageIndex > -1) {
			for (let i = vizMessageIndex - 1; i >= 0; i--) {
				if (messages[i].type === 'user') {
					currentQueryMessage = messages[i];
					break;
				}
			}
		}
	}

	// Update current message atom
	React.useEffect(() => {
		setCurrentMessage(currentQueryMessage);
	}, [currentQueryMessage, setCurrentMessage]);

	const shouldShowVisualization = !!(
		latestVisualizationMessage?.data &&
		latestVisualizationMessage?.chartType &&
		latestVisualizationMessage?.responseType === 'chart'
	);

	return (
		<div className="fixed inset-0 flex flex-col bg-gradient-to-br from-background to-muted/20 pt-16 md:pl-72">
			<div className="flex flex-1 overflow-hidden p-3 sm:p-4 lg:p-6">
				<div className="flex flex-1 flex-col gap-3 overflow-hidden lg:flex-row">
					<div
						className={cn(
							'flex flex-col overflow-hidden',
							shouldShowVisualization ? 'lg:flex-[0.6]' : 'flex-1'
						)}
					>
						<Suspense fallback={<ChatSkeleton />}>
							<ChatSection />
						</Suspense>
					</div>
					{shouldShowVisualization && (
						<div className="flex flex-[0.4] flex-col overflow-hidden">
							<Suspense fallback={<VisualizationSkeleton />}>
								<VisualizationSection />
							</Suspense>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
