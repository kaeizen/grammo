import React from 'react'
import ReactMarkdown from 'react-markdown'
import type { ChatProps } from '../types'

export const Chat: React.FC<ChatProps> = ({ messages = [] }) => {
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
