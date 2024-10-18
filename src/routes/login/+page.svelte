<script lang="ts">
	import { goto } from '$app/navigation';
	import { WSCS } from '../../utilities/api';
	import type { PageData } from './$types';

	export let data: PageData;

	let email: string = '';
	let password: string = '';

	const api = new WSCS(data.api.baseUrl);
</script>

{#if data.api.token}
	<h1>Already logged in</h1>
	<a href="/logout">Logout</a>
{:else}
	<h1>Login</h1>

	<form
		on:submit={(event) => {
			event.preventDefault();
			api
				.login({
					email,
					password
				})
				.then(() => window.location.reload());
		}}
	>
		<input type="text" placeholder="email" bind:value={email} />
		<input type="password" placeholder="password" bind:value={password} />
		<button type="submit">Submit</button>
	</form>
{/if}
