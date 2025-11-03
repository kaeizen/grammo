import { useEffect } from "react";
import { API_ENDPOINT } from "../utils";
/**
 * Detects if the application is running as an installed PWA
 * Checks for standalone display mode and iOS Safari standalone mode
 */
const isPWAInstalled = (): boolean => {
	// Standard PWA detection
	if (window.matchMedia("(display-mode: standalone)").matches) {
		return true;
	}

	// iOS Safari standalone mode
	if (
		(window.navigator as Navigator & { standalone?: boolean }).standalone ===
		true
	) {
		return true;
	}

	// Fullscreen mode (fallback)
	if (window.matchMedia("(display-mode: fullscreen)").matches) {
		return true;
	}

	return false;
};

const endChat = () => {
	// Use sendBeacon for guaranteed sending before unload
	if (navigator.sendBeacon) {
		const url = `${API_ENDPOINT}/api/v1/end/`;
		const data = JSON.stringify({});
		navigator.sendBeacon(url, data);
	} else {
		// Fallback to fetch (not guaranteed)
		fetch(`${API_ENDPOINT}/api/v1/end/`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({}),
	}).catch(() => {
		// Silently handle errors - end chat is a cleanup operation
		// Don't log error details to avoid exposing sensitive information
	});
	}
};


export const useEndChat = (hasActiveSession: boolean) => {
	useEffect(() => {
		if ( ! hasActiveSession ) {
			return
		}

		const isPWA = isPWAInstalled();

		// PWA Mode: Use pagehide for actual app close
		// visibilitychange is tracked but doesn't trigger endChat (preserves state when backgrounded)
		const handlePageHide = (e: PageTransitionEvent) => {
			// Check if page is being unloaded (not just hidden)
			if (e.persisted === false) {
				endChat();
			}
		};

		// Browser Mode: Use beforeunload (existing behavior)
		const handleWindowUnload = () => endChat();

		if (isPWA) {
			window.addEventListener("pagehide", handlePageHide);
		} else {
			window.addEventListener("beforeunload", handleWindowUnload);
		}
		return () => {
			if ( isPWA ) {
				window.removeEventListener("pagehide", handlePageHide);
			} else {
				window.removeEventListener("beforeunload", handleWindowUnload);
			}
		};
	}, [ hasActiveSession ]);
};
