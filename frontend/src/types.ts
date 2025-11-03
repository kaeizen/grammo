import { type ReactNode } from 'react'

export type Message = {
	role: "user" | "assistant";
	content: string;
};

export interface ChatProps {
	messages?: Message[];
}

export interface DropdownOption {
	value: string;
	label: string;
}

export interface DropdownProps {
	label: string;
	value: string;
	options: DropdownOption[];
	onChange: (value: string) => void;
}
export type UseLocalStorageReturn<T> = [T, (value: T | ((val: T) => T)) => void];

export interface TooltipProps {
	children: ReactNode
	text: string
	position?: 'top' | 'bottom' | 'left' | 'right'
	showTooltip?: boolean
}
