import { useEffect, type RefObject } from 'react';

export function useFormHeight(
	formRef: RefObject<HTMLFormElement | null>,
	optionsRef: RefObject<HTMLDivElement | null>,
	showOptions: boolean
) {
	useEffect(() => {
		const updateFormHeight = () => {
			if (formRef.current && optionsRef.current) {
				const formHeight = formRef.current.offsetHeight;
				optionsRef.current.style.setProperty('--form-height', `${-formHeight}px`);
			}
		};

		updateFormHeight();

		// Update on window resize
		window.addEventListener('resize', updateFormHeight);

		// Update when options visibility changes
		if (showOptions) {
			// Small delay to ensure form is rendered
			setTimeout(updateFormHeight, 0);
		}

		return () => {
			window.removeEventListener('resize', updateFormHeight);
		};
	}, [showOptions]);
}

