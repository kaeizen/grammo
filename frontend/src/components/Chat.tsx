import React from 'react'
import ReactMarkdown from 'react-markdown'

interface ChatProps {
	messages?: Array<{
		role: 'user' | 'assistant'
		content: string
	}>
}

export const Chat: React.FC<ChatProps> = ({ messages = [] }) => {
	// Temporary dummy data for display if no messages are passed
	// const dummyMessages = [
	// 	{ role: 'user', content: 'How do I say "Good morning" in German?' },
	// 	{ role: 'assistant', content: "Hello! Type your text below, and I'll help you translate or correct it." },
	// 	{ role: 'user', content: 'Can you check this sentence for me?' },
	// 	{ role: 'assistant', content: "Sure, please enter your sentence and I'll correct any mistakes." }
	// ]

	if ( ! messages.length ) {
	return (
		<div className="hero-message">
			<h2>Welcome to Grammo!</h2>
			<p>
				To get started, type your message below.<br />
				I can help you translate text or correct your sentences. 🚀
			</p>
		</div>
	);
	}

	return (
		<>
			{messages.map((msg, i) => (
				<div
					className={msg.role === 'user' ? 'user message' : 'message'}
					key={`message-${i}`}
				>
					<div>
						<ReactMarkdown>{msg.content}</ReactMarkdown>
					</div>
				</div>
			))}
		</>
	)
}
