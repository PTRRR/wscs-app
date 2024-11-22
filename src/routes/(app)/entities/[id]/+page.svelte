<script lang="ts">
	import LexicalReader from '../../../../components/LexicalReader.svelte';
	import type { PageData } from './$types';

	const props: {
		data: PageData;
	} = $props();
</script>

<section>
	<h1>{props.data.entity.title}</h1>
	<LexicalReader content={props.data.entity.description} />
</section>
