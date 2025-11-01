import { useEffect, useState, type FormEvent } from 'react'
import Cog from './assets/cog.svg'
import Send from './assets/send.svg'
import Dropdown from './components/Dropdown'
import { Chat } from './components/Chat'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [showOptions, setShowOptions] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [mode, setMode] = useState('Default')
  const [tone, setTone] = useState('Default')

  const [ messageToSend, setMessageToSend ] = useState( '' )

  const [ messages, setMessages ] = useState<Message[]>( [] )
  const [ isRetrieving, setIsRetrieving ] = useState( false )


  const handleToggleOptions = () => {
    if (showOptions) {
      setIsClosing(true)
      setTimeout(() => {
        setShowOptions(false)
        setIsClosing(false)
      }, 200)
    } else {
      setIsClosing(false)
      setShowOptions(true)
    }
  }

  const onSubmit = (e: FormEvent) => {
	e.preventDefault()

	console.log( 'message to send', messageToSend )

	setIsRetrieving( true )
  }

  useEffect(() => {
    const retrieveResponse = async () => {
		const message = messageToSend;
		setMessageToSend('');
		setMessages((prev) => [
			...prev,
			{ role: 'user', content: message }
		]);
		try {
			const response = await fetch('http://localhost:8000/api/v1/chat/', {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: message }),
			});
			const jsonres = await response.json();
			console.log('json', jsonres);

			if (jsonres.status === 'success' && jsonres.response) {
				setMessages((prev) => [
					...prev,
					{ role: 'assistant', content: jsonres.response }
				]);
			}
		} catch (error) {
			console.error('Error retrieving response:', error);
		} finally {
			setIsRetrieving(false);
		}
    }

    if (isRetrieving) {
      retrieveResponse();
    }

  }, [isRetrieving]);

  useEffect(() => {
    const endChat = () => {
      // Use sendBeacon for guaranteed sending before unload
      if (navigator.sendBeacon) {
        const url = 'http://localhost:8000/api/v1/end/';
        const data = JSON.stringify({});
        navigator.sendBeacon(url, data);
      } else {
        // Fallback to fetch (not guaranteed)
        fetch('http://localhost:8000/api/v1/end/', {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        }).catch(err => {
          console.error('Error sending end chat:', err);
        });
      }
    };

    const handleWindowUnload = (event: BeforeUnloadEvent) => {
      if (messages.length >= 2) {
        endChat();
      }
    };

    window.addEventListener('beforeunload', handleWindowUnload);

    return () => {
      window.removeEventListener('beforeunload', handleWindowUnload);
    };
  }, [messages]);

  return (
    <>
		<div className="container">
			<div className="header">
				<h1>
					<span role="img" aria-label="books">📚</span> Grammo
					<small>
						Your translation & grammar assistant
					</small>
				</h1>
			</div>
			<div className="chats">
				<Chat messages={messages} />
			</div>
			{(showOptions || isClosing) && (
				<div className={`options ${isClosing ? 'closing' : ''}`}>
					<div className="options-row">
						<Dropdown
							label="Mode"
							value={mode}
							options={[
								{ value: 'Default', label: 'Default' },
								{ value: 'Translation', label: 'Translation' },
								{ value: 'Grammar', label: 'Grammar' },
							]}
							onChange={setMode}
						/>
						<Dropdown
							label="Tone"
							value={tone}
							options={[
								{ value: 'Default', label: 'Default' },
								{ value: 'Formal', label: 'Formal' },
								{ value: 'Informal', label: 'Informal' },
								{ value: 'Casual', label: 'Casual' },
							]}
							onChange={setTone}
						/>
					</div>
				</div>
			)}
			<form className='footer' onSubmit={ onSubmit }>
				<input type='text' placeholder='Type your message...'  autoFocus value={ messageToSend } onChange={ e => setMessageToSend( e.target.value ) }/>
				<div className="button-row">
					<button
						className="cog-button"
						type="button"
						onClick={handleToggleOptions}
						aria-label="Toggle options"
					>
						<img src={ Cog } alt="Settings" />
					</button>
					<button
						type='submit'
						disabled={!messageToSend.trim() || isRetrieving}
					>
						<img src={ Send } alt="Send" className="submit-icon" />
						<span className="submit-text">Send</span>
					</button>
				</div>
			</form>
		</div>
    </>
  )
}

export default App
