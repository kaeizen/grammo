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
			<div className="instructions">
				<h3>Mode:</h3>
				<ul>
					<li><strong>Grammar mode:</strong> The text you enter will be checked for grammar correction.</li>
					<li><strong>Default mode:</strong> You can include instructions with the text you enter for translation or other tasks.</li>
				</ul>
				<h3>Tone:</h3>
				<p>Adjust the tone (Default, Formal, or Casual) to match your communication style.</p>
			</div>
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
