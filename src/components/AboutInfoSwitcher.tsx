import {
  ABOUT_PANEL_OPTIONS,
  type AboutPanelId,
} from "../content/about";

interface AboutInfoSwitcherProps {
  disabled?: boolean;
  onChange: (panelId: AboutPanelId) => void;
  value: AboutPanelId;
}

const AboutInfoSwitcher: React.FC<AboutInfoSwitcherProps> = ({
  disabled = false,
  onChange,
  value,
}) => (
  <div
    className="about-info-switcher"
    role="group"
    aria-label="About section categories"
  >
    {ABOUT_PANEL_OPTIONS.map((panel) => {
      const isActive = panel.id === value;

      return (
        <button
          key={panel.id}
          type="button"
          className="about-info-switcher-option"
          aria-pressed={isActive}
          disabled={disabled}
          onClick={() => onChange(panel.id)}
        >
          {panel.label}
        </button>
      );
    })}
  </div>
);

export default AboutInfoSwitcher;
