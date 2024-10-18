<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { WSCS } from '../../utilities/api';

	export let data: PageData;
	const api = new WSCS(data.api.baseUrl, data.api.token);

	onMount(() => {
		api.logout().finally(() => (window.location.href = window.location.origin));
	});
</script>

<h1>Logging out....</h1>
