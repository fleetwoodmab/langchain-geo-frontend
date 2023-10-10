<script>
	// import Select from './Select.svelte';

	/**
	 * @type {any[]}
	 */
	let chatMessages = [];
	let userInput = '';
	let loading = false;

	let baseURL = '127.0.0.1';
	let port = '8718';

	// hardcoded for now, see TODO below
	let chainName = 'chains.convqa.chain';

	async function demo() {
		userInput = 'Hello! Tell me what you know about vein quartz and include the source.';
		sendMessage();
	}

	/**
	 * answers tend to be formatted as markdown
	 * this function formats line breaks and links into HTML elements
	 */
	async function formatAnswer() {
		// svelte rendering takes a bit until elements are detectable
		await new Promise((r) => setTimeout(r, 200));
		let botMessages = document.getElementsByClassName('bot-message');

		for (var m of botMessages) {
			//replace the linebreaks with <br>
			let text = m.innerHTML;
			text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
			//check for links [text](url)
			let elements = text.match(/\[.*?\)/g);
			if (elements != null && elements.length > 0) {
				for (var el of elements) {
					// @ts-ignore
					let txt = el.match(/\[(.*?)\]/)[1]; //get only the txt
					// @ts-ignore
					let url = el.match(/\((.*?)\)/)[1]; //get only the link
					text = text.replace(el, '<a href="' + url + '" target="_blank">' + txt + '</a>');
				}
			}
			m.innerHTML = text;
		}
	}

	async function sendMessage() {
		if (userInput.trim() !== '') {
			loading = true;

			chatMessages = [...chatMessages, { text: userInput, sender: 'user' }];
			try {
				// emtpy the input field
				let _inputText = userInput;
				userInput = '';

				// Make an HTTP request to the local endpoint
				const response = await fetch(`http://${baseURL}:${port}/${chainName}/run`, {
					method: 'POST',
					headers: {
						accept: 'application/json',
						'Content-Type': 'application/json'
					},
					// schema from SwaggerUI, hardcoded for now, see TODO below
					body: JSON.stringify({ input: _inputText, memory: [{}] })
				});
				const data = await response.json();
				chatMessages = [...chatMessages, { text: data.output, sender: 'bot' }];
			} catch (error) {
				console.error('Error:', error);
				chatMessages = [...chatMessages, { text: error, sender: 'error' }];
			}
			loading = false;
			formatAnswer();
		}
	}
</script>

<!-- TODO: add schema to selection, since this depends on the chain... -->
<!-- <Select
	options={['chains.convqa.chain', 'chains.example.chain']}
	display_func={(o) => o}
	bind:value={chainName}
/> -->

<button on:click={demo}>Press me to run a demo query</button>
<br />
<br />

<div class="message-container">
	{#each chatMessages as message}
		<div class="message {message.sender}-message">{message.text}</div>
	{/each}
	{#if loading}
		<div class="dot-flashing" />
	{/if}
</div>

<div class="user-chatbox">
	<input
		type="text"
		placeholder="Type your message..."
		bind:value={userInput}
		on:keydown={(e) => e.key === 'Enter' && sendMessage()}
	/>
	<button on:click={sendMessage} class="send-button">Send</button>
</div>

<style>
	/* chat interface styling */
	.message-container {
		border: 1px solid #ccc;
		padding: 10px;
		min-height: 10vh;
		max-height: 75vh;
		overflow-y: scroll;
	}
	.message {
		margin: 5px;
		padding: 5px;
		border-radius: 5px;
	}
	.user-message {
		background-color: #f0f0f0;
		text-align: right;
	}
	.bot-message {
		background-color: #e0e0e0;
		text-align: left;
	}
	.error-message {
		background-color: lightcoral;
		text-align: right;
	}

	.user-chatbox {
		width: 50%;
		height: 30px;
		display: flex;
		margin: 1rem auto 0 auto;
		justify-content: space-between;
		border: solid gray;
		border-width: 1px;
		border-radius: 5px;
		padding: 3px;
	}
	.user-chatbox > input {
		width: 100%;
		border: none;
	}
	.user-chatbox > input:focus {
		outline: none;
	}
	.user-chatbox > button {
		min-width: fit-content;
		margin-left: 0.5em;
	}

	/**
	*  typing... dots animation adapted from https://codepen.io/nzbin/pen/GGrXbp
	*/

	:root {
		--dot-color: rgb(52, 52, 52);
		--dot-color-faded: rgba(52, 52, 52, 0.2);
	}

	.dot-flashing {
		position: relative;
		margin-left: 20px;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		background-color: var(--dot-color);
		color: var(--dot-color);
		animation: dot-flashing 1s infinite linear alternate;
		animation-delay: 0.5s;
	}
	.dot-flashing::before,
	.dot-flashing::after {
		content: '';
		display: inline-block;
		position: absolute;
		left: 0;
	}
	.dot-flashing::before {
		left: -15px;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		background-color: var(--dot-color);
		color: var(--dot-color);
		animation: dot-flashing 1s infinite alternate;
		animation-delay: 0s;
	}
	.dot-flashing::after {
		left: 15px;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		background-color: var(--dot-color);
		color: var(--dot-color);
		animation: dot-flashing 1s infinite alternate;
		animation-delay: 1s;
	}

	@keyframes dot-flashing {
		0% {
			background-color: var(--dot-color);
		}
		50%,
		100% {
			background-color: var(--dot-color-faded);
		}
	}
</style>
