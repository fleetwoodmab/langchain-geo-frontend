<script>
	import ChatBot from './ChatBot.svelte';
</script>

<div class="botbox">
	<h1>Chat Component Demo</h1>
	<p>⚠️ Start the servers for ChromaDB and LangServe before making requests! ⚠️</p>

	<ChatBot />
</div>

<style>
	.botbox {
		max-width: 80%;
		margin: 0 auto 0;
		height: 80vh;
	}
</style>
