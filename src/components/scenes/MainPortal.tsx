import CategoryPage from "./categoryPage/CategoryPage";
import MainLayout from "./MainLayout";
import PublishPage from "./publishPage/PublishPage";
import SportPage from "./sportPage/SportPage"
import TricksPage from "./tricksPage/TrickPage";
import AccountPage from "./userPage/AccountPage";
import UserPage from "./userPage/UserPage"
import VariantPage from "./variantsPage/VariantPage";

type PortalType = 
| "SPORTS" 
| "CATEGORIES" 
| "TRICKS"
| "VARIANTS"
| "PUBLISH"
| "USERS" 
| "ACCOUNT";

interface Props {
  portalType: PortalType;
}

const MainPrortal: React.FunctionComponent<React.PropsWithChildren<Props>> = ({
  portalType,
  children,
}) => {
  console.log("Render", portalType);
  return (
    <MainLayout currentKey={portalType}>
      {portalType === "SPORTS" && <SportPage/>}
      {portalType === "CATEGORIES" && <CategoryPage/>}
      {portalType === "TRICKS" && <TricksPage/>}
      {portalType === "PUBLISH" && <PublishPage/>}
      {portalType === "VARIANTS" && <VariantPage/>}
      {portalType === "USERS" && <UserPage/>}
      {portalType === "ACCOUNT" && <AccountPage/>}
    </MainLayout>
  );
};

export default MainPrortal;
