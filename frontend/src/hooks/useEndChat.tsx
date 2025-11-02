import { useEffect } from "react";
import type { Message } from "../types";

export const useEndChat = (messages: Message[]) => {
	useEffect(() => {
		const endChat = () => {
			// Use sendBeacon for guaranteed sending before unload
			if (navigator.sendBeacon) {
				const url = "api/v1/end/";
				const data = JSON.stringify({});
				navigator.sendBeacon(url, data);
			} else {
				// Fallback to fetch (not guaranteed)
				fetch("api/v1/end/", {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({}),
				}).catch((err) => {
					console.error("Error sending end chat:", err);
				});
			}
		};

		const handleWindowUnload = () => {
			if (messages.length >= 2) {
				endChat();
			}
		};

		window.addEventListener("beforeunload", handleWindowUnload);

		return () => {
			window.removeEventListener("beforeunload", handleWindowUnload);
		};
	}, [messages]);
};
