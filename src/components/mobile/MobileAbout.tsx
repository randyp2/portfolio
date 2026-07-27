import type { AboutPanelId } from "../../content/about";
import { useRandomizedPanelTransition } from "../../hooks/useRandomizedPanelTransition";
import AboutInfoSwitcher from "../AboutInfoSwitcher";
import AboutPanelContent from "../AboutPanelContent";

/**
 * Renders the inline About Me section in the mobile document flow.
 */
const MobileAbout: React.FC = () => {
  const {
    activeValue: activePanelId,
    isTransitioning,
    panelRef,
    requestValue: setActivePanelId,
    selectedValue: selectedPanelId,
  } = useRandomizedPanelTransition<AboutPanelId>("now");

  return (
    <section id="about" className="px-5 py-24">
      <div className="mb-8 flex justify-end">
        <AboutInfoSwitcher
          disabled={isTransitioning}
          value={selectedPanelId}
          onChange={setActivePanelId}
        />
      </div>
      <div className="about-panel-transition-host">
        <div
          ref={panelRef}
          className="about-panel-view"
          aria-live="polite"
          aria-busy={isTransitioning}
        >
          <AboutPanelContent panelId={activePanelId} />
        </div>
      </div>
    </section>
  );
};

export default MobileAbout;
