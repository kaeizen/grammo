export const getErrorMessage = (err: Error) => {
	// Determine error type and use generic, safe error messages
	let errorType: "network" | "server" | "unknown" = "unknown";
	let errorMessage = "An unexpected error occurred. Please try again.";

	// Network errors (server not available, CORS, etc.)
	if (
		err instanceof TypeError ||
		err.message.includes("Failed to fetch") ||
		err.message.includes("NetworkError") ||
		err.message.includes("Network request failed")
	) {
		errorType = "network";
		errorMessage = "Unable to connect to the server. Please check your connection and try again.";
	} else if (err.message.startsWith("HTTP_")) {
		// HTTP error codes - use generic message
		const statusCode = err.message.replace("HTTP_", "");
		if (statusCode === "500" || statusCode.startsWith("5")) {
			errorType = "server";
			errorMessage = "A server error occurred. Please try again later.";
		} else if (statusCode === "400" || statusCode === "401" || statusCode === "403") {
			errorType = "server";
			errorMessage = "Invalid request. Please try again.";
		} else {
			errorType = "server";
			errorMessage = "An error occurred. Please try again.";
		}
	} else if (err.message === "INVALID_RESPONSE") {
		errorType = "server";
		errorMessage = "Received an invalid response from the server. Please try again.";
	} else {
		// Unknown error - use generic message
		errorType = "unknown";
		errorMessage = "An unexpected error occurred. Please try again.";
	}

	return { errorType, errorMessage }
}
