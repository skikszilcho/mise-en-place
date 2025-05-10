export function calculatePasswordStrength(password) {
  let score = 0;

  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length < 128) score++;

  // Character variety
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Clamp to 6
  score = Math.min(score, 6);

  let label = "Weak";
  let color = "bg-red-500";

  if (score >= 3) {
    label = "Fair";
    color = "bg-yellow-500";
  }

  if (score >= 5) {
    label = "Strong";
    color = "bg-green-500";
  }

  return {
    score,
    label,
    color,
    checks: {
      length8: password.length >= 8,
      length12: password.length >= 12,
      length128: password.length < 128,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    },
  };
}