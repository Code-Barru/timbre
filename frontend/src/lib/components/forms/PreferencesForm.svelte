<script lang="ts">
	import { untrack } from 'svelte';
	import { updatePreferences } from '$api/preferences';
	import { ApiError } from '$api/errors';
	import type { PatchPreferencesInput, UserPreferences } from '$api/schemas/preferences';
	import { Button } from '$lib/components/ui/buttons';
	import { Card } from '$lib/components/ui/display';
	import { Alert, toasts } from '$lib/components/ui/feedback';
	import { Field, Form, Input, Slider, Switch } from '$lib/components/ui/forms';

	let { initial }: { initial: UserPreferences } = $props();

	function toForm(preferences: UserPreferences) {
		return {
			newPerDay: preferences.newPerDay,
			reviewsPerDay: preferences.reviewsPerDay,
			maxNewPerGroupPerDay: preferences.maxNewPerGroupPerDay,
			learningStepsMin: preferences.learningStepsMin.join(' '),
			relearningStepsMin: preferences.relearningStepsMin.join(' '),
			desiredRetention: preferences.desiredRetention,
			maxIntervalDays: preferences.maxIntervalDays,
			burySiblings: preferences.burySiblings
		};
	}

	function parseSteps(raw: string): number[] {
		return raw
			.split(/[\s,]+/)
			.filter(Boolean)
			.map(Number);
	}

	let saved = $state(untrack(() => toForm(initial)));
	let form = $state(untrack(() => toForm(initial)));
	let submitting = $state(false);
	let formError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string[]>>({});

	const changes = $derived.by(() => {
		const patch: PatchPreferencesInput = {};
		if (form.newPerDay !== saved.newPerDay) patch.newPerDay = form.newPerDay;
		if (form.reviewsPerDay !== saved.reviewsPerDay) patch.reviewsPerDay = form.reviewsPerDay;
		if (form.maxNewPerGroupPerDay !== saved.maxNewPerGroupPerDay)
			patch.maxNewPerGroupPerDay = form.maxNewPerGroupPerDay;
		if (form.learningStepsMin !== saved.learningStepsMin)
			patch.learningStepsMin = parseSteps(form.learningStepsMin) as [number, ...number[]];
		if (form.relearningStepsMin !== saved.relearningStepsMin)
			patch.relearningStepsMin = parseSteps(form.relearningStepsMin) as [number, ...number[]];
		if (form.desiredRetention !== saved.desiredRetention)
			patch.desiredRetention = form.desiredRetention;
		if (form.maxIntervalDays !== saved.maxIntervalDays)
			patch.maxIntervalDays = form.maxIntervalDays;
		if (form.burySiblings !== saved.burySiblings) patch.burySiblings = form.burySiblings;
		return patch;
	});

	const dirty = $derived(Object.keys(changes).length > 0);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting || !dirty) return;

		submitting = true;
		formError = null;
		fieldErrors = {};

		try {
			const preferences = await updatePreferences(changes);
			saved = toForm(preferences);
			form = toForm(preferences);
			toasts.push({ tone: 'success', title: 'Preferences saved' });
		} catch (err) {
			if (err instanceof ApiError) {
				formError = err.message;
				fieldErrors = err.fieldErrors ?? {};
			} else {
				formError = 'Unknown error';
			}
		} finally {
			submitting = false;
		}
	}
</script>

{#snippet header()}
	<h2 class="text-h3 text-fg">Study</h2>
	<p class="text-sm text-fg-muted">Daily limits and scheduling for your reviews.</p>
{/snippet}

<Card {header}>
	<Form {onsubmit} gap="lg">
		{#if formError}
			<Alert tone="danger">{formError}</Alert>
		{/if}

		<div class="grid gap-4 sm:grid-cols-3">
			<Field
				label="New cards / day"
				info="Maximum number of never-seen cards introduced each day."
				error={fieldErrors.newPerDay?.[0]}
			>
				<Input bind:value={form.newPerDay} type="number" min={0} />
			</Field>
			<Field
				label="Reviews / day"
				info="Maximum number of due cards shown each day."
				error={fieldErrors.reviewsPerDay?.[0]}
			>
				<Input bind:value={form.reviewsPerDay} type="number" min={0} />
			</Field>
			<Field
				label="New / group / day"
				info="Limits how many new cards from the same group (e.g. a grammatical case, an aspect pair, a sound contrast) are introduced on the same day, so similar items don't interfere with each other."
				error={fieldErrors.maxNewPerGroupPerDay?.[0]}
			>
				<Input bind:value={form.maxNewPerGroupPerDay} type="number" min={0} />
			</Field>
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			<Field
				label="Learning steps"
				info="Delays, in minutes, between the first showings of a new card before it graduates to regular reviews. For example, 1 10 shows it again after 1 minute, then after 10 minutes."
				error={fieldErrors.learningStepsMin?.[0]}
			>
				<Input bind:value={form.learningStepsMin} />
			</Field>
			<Field
				label="Relearning steps"
				info="Delays, in minutes, before a card you forgot is shown again, until it returns to regular reviews."
				error={fieldErrors.relearningStepsMin?.[0]}
			>
				<Input bind:value={form.relearningStepsMin} />
			</Field>
		</div>

		<Field
			label="Desired retention"
			info="The probability of remembering a card when it comes up for review. A higher value means shorter intervals and more reviews each day."
			error={fieldErrors.desiredRetention?.[0]}
		>
			<Slider
				bind:value={form.desiredRetention}
				min={0.7}
				max={0.99}
				step={0.01}
				showValue
				formatValue={(value) => `${Math.round(value * 100)}%`}
			/>
		</Field>

		<Field
			label="Maximum interval (days)"
			info="Upper limit on the delay between two reviews of the same card."
			error={fieldErrors.maxIntervalDays?.[0]}
		>
			<Input bind:value={form.maxIntervalDays} type="number" min={1} />
		</Field>

		<Field
			hint="Delay other cards of the same note until the next day."
			error={fieldErrors.burySiblings?.[0]}
		>
			<Switch bind:checked={form.burySiblings}>Bury siblings</Switch>
		</Field>

		{#snippet actions()}
			<Button type="submit" loading={submitting} disabled={!dirty}>Save</Button>
		{/snippet}
	</Form>
</Card>
