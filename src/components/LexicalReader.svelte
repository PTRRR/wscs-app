<script lang="ts">
	import LexicalNode from './LexicalNode.svelte';
	import type { LexicalRoot } from './LexicalNode.svelte';

	const props: { content?: LexicalRoot | null } = $props();
</script>

<div class="lexical-reader">
	{#if props.content?.root}
		<LexicalNode node={props.content.root} />
	{/if}
</div>
