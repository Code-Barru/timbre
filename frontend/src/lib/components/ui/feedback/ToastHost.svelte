<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import Toast from './Toast.svelte';
	import { toasts } from './toasts.svelte';
</script>

<div
	class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
>
	{#each toasts.items as toast (toast.id)}
		<div
			class="pointer-events-auto"
			role={toast.tone === 'danger' ? 'alert' : 'status'}
			aria-live={toast.tone === 'danger' ? 'assertive' : 'polite'}
			animate:flip={{ duration: 200 }}
			in:fly={{ y: 12, duration: 200 }}
			out:fly={{ y: 12, duration: 150 }}
		>
			<Toast
				{toast}
				ondismiss={() => toasts.dismiss(toast.id)}
				onpause={() => toasts.pause(toast.id)}
				onresume={() => toasts.resume(toast.id)}
			/>
		</div>
	{/each}
</div>
