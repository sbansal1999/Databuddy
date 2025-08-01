'use client';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeTogglerProps = {
	className?: string;
};

export function ThemeToggle({ className }: ThemeTogglerProps) {
	const { resolvedTheme, setTheme } = useTheme();

	const switchTheme = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
	};

	const toggleTheme = () => {
		if (!document.startViewTransition) {
			switchTheme();
		}
		document.startViewTransition(switchTheme);
	};

	return (
		<Button
			aria-label="Toggle theme"
			className={cn(
				'relative hidden h-8 w-8 transition-all duration-200 hover:bg-accent/50 md:flex',
				className
			)}
			onClick={toggleTheme}
			type="button"
			variant="ghost"
		>
			<SunIcon
				className="dark:-rotate-90 h-5 w-5 rotate-0 scale-100 not-dark:text-primary transition-all duration-300 dark:scale-0"
				size={32}
				weight="duotone"
			/>
			<MoonIcon
				className="absolute h-5 w-5 rotate-90 scale-0 not-dark:text-primary transition-all duration-300 dark:rotate-0 dark:scale-100"
				size={32}
				weight="duotone"
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
