import { z } from 'zod';

function isLetter(char: string): boolean {
	return char.toLowerCase() !== char.toUpperCase();
}

function isDigit(char: string): boolean {
	return char >= '0' && char <= '9';
}

function isValidNameChar(char: string): boolean {
	return isLetter(char) || char === ' ' || char === '-' || char === "'";
}

function isValidName(name: string): boolean {
	return (
		name.length > 0 && !name.includes('  ') && isLetter(name[0]) && [...name].every(isValidNameChar)
	);
}

const email = z.email('auth_email_invalid');

const password = z
	.string()
	.min(8, 'auth_password_invalid')
	.refine(
		(value) => [...value].some(isLetter) && [...value].some(isDigit),
		'auth_password_invalid'
	);

const name = z
	.string()
	.trim()
	.min(2, 'sign_up_name_invalid')
	.max(50, 'sign_up_name_invalid')
	.refine(isValidName, 'sign_up_name_invalid');

export const signInSchema = z.object({
	email,
	password
});

export const signUpSchema = z.object({
	name,
	email,
	password
});
