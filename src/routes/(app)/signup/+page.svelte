<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { WSCS } from '../../../utilities/api';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let email: HTMLInputElement;
	let emailValue: string;
	let passwordValue: string;
	let repeatpasswordValue: string;

	const api = new WSCS(data.api.baseUrl);

	onMount(() => {
		email.focus();
	});
</script>

<h1>Signup</h1>

<form
	on:submit|preventDefault={async () => {
		if (passwordValue !== repeatpasswordValue) {
			alert('Passwords do not match');
			return;
		}

		try {
			await api.createUser({
				email: emailValue,
				password: passwordValue,
				passwordConfirg: repeatpasswordValue
			});
			goto('/login');
		} catch (error) {
			console.error(error);
		} finally {
			// Clear the form fields
			emailValue = '';
			passwordValue = '';
			repeatpasswordValue = '';
		}
	}}
>
	<input type="email" placeholder="Email" bind:this={email} bind:value={emailValue} />
	<input type="password" placeholder="Password" name="password" bind:value={passwordValue} />
	<input
		type="password"
		placeholder="Repeat password"
		name="repeatpassword"
		bind:value={repeatpasswordValue}
	/>
	<button type="submit">Submit</button>
</form>

<a href="/login">Login</a>
