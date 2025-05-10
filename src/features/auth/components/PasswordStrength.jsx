import { calculatePasswordStrength } from "../utils/passwordStrength";

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const { score, label, color, checks } =
    calculatePasswordStrength(password);

  const percentage = (score / 6) * 100;

  return (
    <div className="mt-2 space-y-3">

      {/* Strength label */}
      <div className="flex justify-between text-sm">
        <span>Password Strength</span>
        <span className="font-semibold">{label}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Requirements */}
      <ul className="space-y-1 text-xs">

        <li className={checks.length8 ? "text-green-600" : "text-gray-500"}>
          {checks.length8 ? "✓" : "○"} At least 8 characters
        </li>

        <li className={checks.length12 ? "text-green-600" : "text-gray-500"}>
          {checks.length12 ? "✓" : "○"} 12+ characters (recommended)
        </li>

        <li className={checks.length128 ? "text-green-600" : "text-gray-500"}>
          {checks.length128 ? "✓" : "○"} less than 128 characters
        </li>

        <li className={checks.lowercase ? "text-green-600" : "text-gray-500"}>
          {checks.lowercase ? "✓" : "○"} Lowercase letter
        </li>

        <li className={checks.uppercase ? "text-green-600" : "text-gray-500"}>
          {checks.uppercase ? "✓" : "○"} Uppercase letter
        </li>

        <li className={checks.number ? "text-green-600" : "text-gray-500"}>
          {checks.number ? "✓" : "○"} Number
        </li>

        <li className={checks.special ? "text-green-600" : "text-gray-500"}>
          {checks.special ? "✓" : "○"} Special character
        </li>

      </ul>
    </div>
  );
}