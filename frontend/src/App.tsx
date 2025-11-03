
import type { Message } from "./types";
import { useState, useRef, type FormEvent } from "react";
import { useLocalStorage, useEndChat,
	useFormHeight, useSendChat } from "./hooks";

import Cog from "./assets/cog.svg";
import Send from "./assets/send.svg";
import Clean from './assets/clean.svg'

import Dropdown from "./components/Dropdown";
import { Chat } from "./components/Chat";
import { Tooltip } from "./components/Tooltip";

function App() {
	const [ mode, setMode ] = useLocalStorage('gm_mode', 'Default')
	const [ tone, setTone ] = useLocalStorage( 'gm_tone', 'Default')

	const [ showOptions, setShowOptions ] = useState(false);
	const [ messageToSend, setMessageToSend ] = useState("");
	const [ hasActiveSession, setHasActiveSession ] = useState(false);
	const [ chatSession, setChatSession ] = useState(0);

	const [messages, setMessages] = useState<Message[]>([]);
	const [isRetrieving, setIsRetrieving] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);

	useFormHeight(formRef, optionsRef, showOptions);
	useEndChat(hasActiveSession);
	const error = useSendChat(isRetrieving, chatSession,
		mode, tone, messageToSend, setMessageToSend,
		setMessages, setIsRetrieving
	);

	const handleToggleOptions = () => {
		setShowOptions( prev => ! prev )
	};

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		setIsRetrieving(true);

		if ( ! hasActiveSession ) {
			setHasActiveSession(true);
		}
	};

	const resetChat = () => {
		fetch("api/v1/end/", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({}),
		}).catch(() => {
			// Silently handle errors - end chat is a cleanup operation
			// Don't log error details to avoid exposing sensitive information
		});
		setHasActiveSession(false);
		setMessages([]);
		setChatSession(prev => prev + 1);
	}

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
				<div className="chats">
					<div><Chat messages={messages} /></div>
					{error && (
						<div className="error-message">
							<p>{error.message}</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="footer">
					<div ref={optionsRef} className={`options ${ showOptions ? "visible" : ""}`}>
						<div className="options-row">
							<Dropdown
								label="Mode"
								value={mode}
								options={[
									{ value: "default", label: "Default" },
									{ value: "grammar", label: "Grammar" },
								]}
								onChange={setMode}
							/>
							<Dropdown
								label="Tone"
								value={tone}
								options={[
									{ value: "default", label: "Default" },
									{ value: "formal", label: "Formal" },
									{ value: "casual", label: "Casual" },
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
							<Tooltip text="Options" position="top">
								<button
									className="cog-button button"
									type="button"
									onClick={handleToggleOptions}
									aria-label="Toggle options"
								>
									<img src={Cog} alt="Settings" />
								</button>
							</Tooltip>
							<Tooltip text="Clear chat" position="top">
								<button
									className="reset-button button"
									type="button"
									onClick={resetChat}
									aria-label="Reset Chat"
								>
									<img src={Clean} alt="Clear" />
								</button>
							</Tooltip>
							<button
								type="submit"
								disabled={!messageToSend.trim() || isRetrieving || error !== null }
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
