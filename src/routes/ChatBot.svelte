<script>
  /**
	 * @type {any[]}
	 */
  let chatMessages = [{ text: 'hi', sender: 'bot' }];
  let userInput = '';

  async function sendMessage() {
    console.log(JSON.stringify({ "question" : userInput }))

    if (userInput.trim() !== '') {
      chatMessages = [...chatMessages, { text: userInput, sender: 'user' }];
      // Make an HTTP request to your local endpoint
      try {
        const response = await fetch('http://127.0.0.1:8000/dummy_endpoint.chain/run', {
          method: 'POST',
          mode: "no-cors",
          headers: {
            'Content-Type': 'application/json',
          },
          body: '{\n"question": "string"\n}' // JSON.stringify({ "question" : userInput }),
        });
        const data = await response.json();
        chatMessages = [...chatMessages, { text: data.response, sender: 'bot' }];
      } catch (error) {
        console.error('Error:', error);
      }
      userInput='';
    }
  }
</script>

<div class="chat-container">
  {#each chatMessages as message }
    <div class="message {message.sender}-message">{message.text}</div>
  {/each}
</div>


<div>
  <input
    type="text"
    placeholder="Type your message..."
    bind:value={userInput}
    on:keydown={(e) => e.key === 'Enter' && sendMessage()}
  />
  <button on:click={sendMessage}>Send</button>
</div>


<style>
  /* Add your chat interface styling here */
  .chat-container {
    border: 1px solid #ccc;
    padding: 10px;
    max-height: 300px;
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
</style>



