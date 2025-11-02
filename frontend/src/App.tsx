import { useEffect, useState, useRef, type FormEvent } from "react";
import Cog from "./assets/cog.svg";
import Send from "./assets/send.svg";
import Dropdown from "./components/Dropdown";
import { Chat } from "./components/Chat";
import type { Message } from "./types";
import { useLocalStorage, useEndChat } from "./hooks";

function App() {
	const [showOptions, setShowOptions] = useState(false);
	const [ mode, setMode ] = useLocalStorage('gm_mode', 'Default')
	const [ tone, setTone ] = useLocalStorage( 'gm_tone', 'Default')
	const [messageToSend, setMessageToSend] = useState("");

	const [messages, setMessages] = useState<Message[]>([]);
	const [isRetrieving, setIsRetrieving] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);

	const handleToggleOptions = () => {
		setShowOptions( prev => ! prev )
	};

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

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		setIsRetrieving(true);
	};

	useEffect(() => {
		const retrieveResponse = async () => {
			const message = messageToSend;
			setMessageToSend("");
			setMessages((prev) => [
				...prev,
				{ role: "user", content: message },
			]);
			try {
				const response = await fetch("api/v1/chat/",
					{
						method: "POST",
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ message: message }),
					}
				);
				const jsonres = await response.json();
				console.log("json", jsonres);

				if (jsonres.status === "success" && jsonres.response) {
					setMessages((prev) => [
						...prev,
						{ role: "assistant", content: jsonres.response },
					]);
				}
			} catch (error) {
				console.error("Error retrieving response:", error);
			} finally {
				setIsRetrieving(false);
			}
		};

		if (isRetrieving) {
			retrieveResponse();
		}
	}, [isRetrieving]);

	useEndChat(messages);

	return (
		<>
			<div className="container">

				{/* Header */}
				<div className="header">
					<h1>
						<span role="img" aria-label="books">
							📚
						</span>{" "}
						Grammo
						<small>Your translation & grammar assistant</small>
					</h1>
				</div>

				{/* Chats */}
				<div className="chats"><Chat messages={messages} /></div>

				{/* Footer */}
				<div className="footer">
					<div ref={optionsRef} className={`options ${ showOptions ? "visible" : ""}`}>
						<div className="options-row">
							<Dropdown
								label="Mode"
								value={mode}
								options={[
									{ value: "Default", label: "Default" },
									{ value: "Translation", label: "Translation" },
									{ value: "Grammar", label: "Grammar" },
								]}
								onChange={setMode}
							/>
							<Dropdown
								label="Tone"
								value={tone}
								options={[
									{ value: "Default", label: "Default" },
									{ value: "Formal", label: "Formal" },
									{ value: "Informal", label: "Informal" },
									{ value: "Casual", label: "Casual" },
								]}
								onChange={setTone}
							/>
						</div>
					</div>
					<form ref={formRef} onSubmit={onSubmit}>
						<input
							type="text"
							placeholder="Type your message..."
							autoFocus
							value={messageToSend}
							onChange={(e) => setMessageToSend(e.target.value)}
						/>
						<div className="button-row">
							<button
								className="cog-button"
								type="button"
								onClick={handleToggleOptions}
								aria-label="Toggle options"
							>
								<img src={Cog} alt="Settings" />
							</button>
							<button
								type="submit"
								disabled={!messageToSend.trim() || isRetrieving}
							>
								<img
									src={Send}
									alt="Send"
									className="submit-icon"
								/>
								<span className="submit-text">Send</span>
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default App;
