import MobileIntro from "./mobile/MobileIntro";
import MobileAbout from "./mobile/MobileAbout";
import MobileProjects from "./mobile/MobileProjects";
import MobileSkills from "./mobile/MobileSkills";
import MobileContact from "./mobile/MobileContact";
import MobileFooter from "./mobile/MobileFooter";

const MobilePage: React.FC = () => {
  return (
    <div className="pt-14">
      <MobileIntro />
      <MobileAbout />
      <MobileProjects />
      <MobileSkills />
      <MobileContact />
      <MobileFooter />
    </div>
  );
};

export default MobilePage;
