import { useTheme } from '../ThemeContext';
import Icon from './Icon';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
    >
      <span className="tt-knob">
        <span className="tt-sun"><Icon name="sun" size={16} /></span>
        <span className="tt-moon"><Icon name="moon" size={16} /></span>
      </span>
    </button>
  );
}