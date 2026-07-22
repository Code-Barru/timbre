import { z } from 'zod';

// Source of truth for the card_type_enum Postgres type.
export const CARD_TYPES = ['basic', 'cloze', 'minimal_pair'] as const;

const gender = z.enum(['m', 'f', 'n']);

const basicCardPayload = z.object({
	type: z.literal('basic'),
	word: z.string().min(1),
	ipa: z.string().optional(),
	image: z.string().optional(),
	audioSrc: z.string().optional(),
	gender: gender.optional(),
	tag: z.string().optional(),
	mnemonic: z.string().optional(),
	personalNote: z.string().optional(),
	pos: z.string().optional()
});

const clozeCardPayload = z.object({
	type: z.literal('cloze'),
	before: z.string(),
	after: z.string(),
	answer: z.string().min(1),
	hint: z.string().optional(),
	ipa: z.string().optional(),
	gloss: z.string().optional()
});

const minimalPairOption = z.object({
	word: z.string().min(1),
	ipa: z.string().optional()
});

const minimalPairCardPayload = z.object({
	type: z.literal('minimal_pair'),
	audioSrc: z.string(),
	options: z.array(minimalPairOption).min(2),
	correctIndex: z.int().nonnegative(),
	gloss: z.string().optional()
});

export const cardPayloadSchema = z
	.discriminatedUnion('type', [basicCardPayload, clozeCardPayload, minimalPairCardPayload])
	.check((ctx) => {
		const value = ctx.value;
		if (value.type === 'minimal_pair' && value.correctIndex >= value.options.length) {
			ctx.issues.push({
				code: 'custom',
				message: 'card_minimal_pair_correct_index_out_of_range',
				path: ['correctIndex'],
				input: value
			});
		}
	});

export type CardPayload = z.infer<typeof cardPayloadSchema>;

export type CardType = CardPayload['type'];

/** Payload shape per card type, so `type` and `payload` stay correlated. */
export type CardPayloadMap = { [T in CardType]: Extract<CardPayload, { type: T }> };
