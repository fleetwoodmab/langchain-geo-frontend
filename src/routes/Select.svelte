<script>
      /**
	 * @type {string[]}
	 */
    export let options = [];
    export let display_func = (/** @type {string} */ a) => a;
    export let index = 0; // starting index
    export let value;
  
    $: {
      value = options[index];
    }
  </script>
  
  <select bind:value={index}>
    {#each options as option, i}
      <option value={i}>{display_func(option)}</option>
    {/each}
  </select>