import { useEffect, useState, useRef } from "react";
import type { Message } from "../types";
import { getErrorMessage } from "../utils/errors";
import { API_ENDPOINT } from "../utils";
interface ErrorState {
	message: string;
	type: "network" | "server" | "unknown";
}

export const useSendChat = (
	isRetrieving: boolean,
	chatSession: number,
	mode: string,
	tone: string,
	messageToSend: string,
	setMessageToSend: (value: string) => void,
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
	setIsRetrieving: (value: boolean) => void
): ErrorState | null => {
	const [error, setError] = useState<ErrorState | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Clear error when chat session changes (e.g., on reset)
	useEffect(() => {
		setError(null);
	}, [chatSession]);

	useEffect(() => {
		console.log('API', API_ENDPOINT);
		// Only proceed if we're retrieving and there's a message to send
		if (!isRetrieving || !messageToSend.trim()) {
			return;
		}

		// Create abort controller for this request
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		// Store the message content to remove it later if request fails
		const messageContent = messageToSend;

		// Add user message to chat
		const userMessage: Message = {
			role: "user",
			content: messageContent,
		};

		setMessages((prev) => [...prev, userMessage]);
		setMessageToSend("");
		setError(null); // Clear any previous errors

		// Send message to server
		fetch(`${API_ENDPOINT}/api/v1/chat/`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: messageContent,
				chatSession: chatSession,
				mode,
				tone,
			}),
			signal: abortController.signal,
		})
			.then(async (response) => {
				// Check if response is ok (status 200-299)
				if (!response.ok) {
					// Use generic error message
					throw new Error(`HTTP_${response.status}`);
				}

				return response.json();
			})
			.then((data) => {
				// Check if response has success status
				if (data.status === "success" && data.response) {
					// Add assistant response to chat
					const assistantMessage: Message = {
						role: "assistant",
						content: data.response,
					};

					setMessages((prev) => [...prev, assistantMessage]);
					setError(null);
				} else {
					// Invalid response format - use generic error
					throw new Error("INVALID_RESPONSE");
				}
			})
			.catch((err) => {
				// Handle abort (component unmounted or new request)
				if (err.name === "AbortError") {
					return;
				}

				const { errorMessage, errorType } = getErrorMessage( err );

				setError({
					message: errorMessage,
					type: errorType,
				});
			})
			.finally(() => {
				// Reset retrieving state
				setIsRetrieving(false);
				abortControllerRef.current = null;
			});

		// Cleanup: abort request if component unmounts or dependencies change
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [isRetrieving]);

	return error;
};

