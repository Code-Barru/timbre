export function hasPasswordComplexity(password: string): boolean {
	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasDigit = /[0-9]/.test(password);
	return hasLowercase && hasUppercase && hasDigit;
}
