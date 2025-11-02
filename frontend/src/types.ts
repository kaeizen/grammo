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
