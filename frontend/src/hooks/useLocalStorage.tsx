import { useState, useCallback } from "react";
import type { UseLocalStorageReturn } from "../types";

/**
 * useLocalStorage React hook
 *
 * Synchronizes a state variable with localStorage, allowing persistent state across reloads.
 *
 * @template T - Type of the stored value.
 * @param {string} key - The localStorage key to read from and write to.
 * @param {T | (() => T)} initialValue - The initial value to use if nothing is found in localStorage.
 *   This may be a value or a function returning a value (for lazy initialization).
 * @returns {[T, (value: T | ((val: T) => T)) => void]} An array with the current stateful value and a setter.
 *
 * Usage:
 *   const [value, setValue] = useLocalStorage("myKey", "default");
 *
 *   setValue("something"); // Updates value and localStorage.
 */
export const useLocalStorage = <T,>(key: string, initialValue: T | (() => T)): UseLocalStorageReturn<T> => {
	/**
	 * Retrieves the stored value from localStorage, or falls back to initialValue.
	 * Handles JSON parsing and function initial values.
	 */
	const getStoredValue = (): T => {
		try {
			const item = window.localStorage.getItem(key);
			if (item !== null) {
				return JSON.parse(item);
			}
			if (typeof initialValue === "function") {
				// @ts-ignore
				return initialValue();
			}
			return initialValue;
		} catch (error) {
			// If JSON.parse or other errors occur, return initial value
			return typeof initialValue === "function" ? (initialValue as any)() : initialValue;
		}
	};

	const [storedValue, setStoredValueState] = useState<T>(getStoredValue);

	/**
	 * Updates both state and localStorage with the new value.
	 * Accepts either a value or an updater function.
	 */
	const setStoredValue = useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;
				setStoredValueState(valueToStore);
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			} catch (error) {
				// Ignore write errors
			}
		},
		[key, storedValue]
	);

	return [storedValue, setStoredValue] as const;
}
