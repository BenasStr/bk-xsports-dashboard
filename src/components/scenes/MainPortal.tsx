import CategoryAddPage from "./categoryPage/CategoryAddPage";
import CategoryEditPage from "./categoryPage/CategoryEditPage";
import CategoryPage from "./categoryPage/CategoryPage";
import MainLayout from "./MainLayout";
import SamplePage from "./samplepage/SamplePage";
import SportAddPage from "./sportPage/SportAddPage";
import SportsEditPage from "./sportPage/SportEditPage";
import SportPage from "./sportPage/SportPage"
import AccountPage from "./userPage/AccountPage";
import UserPage from "./userPage/UserPage"

type PortalType = 
|"SPORTS" 
| "SPORTS_EDIT"
| "SPORTS_ADD"
| "SAMPLE" 
| "CATEGORIES" 
| "CATEGORIES_ADD"
| "CATEGORIES_EDIT"
| "USERS" 
| "ACCOUNT"
| "?";

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
      {portalType === "?" && <>?</>}
      {portalType === "SAMPLE" && <SamplePage />}
      {portalType === "SPORTS_EDIT" && <SportsEditPage/>}
      {portalType === "SPORTS_ADD" && <SportAddPage/>}
      {portalType === "SPORTS" && <SportPage/>}
      {portalType === "CATEGORIES_ADD" && <CategoryAddPage/>}
      {portalType === "CATEGORIES_EDIT" && <CategoryEditPage/>}
      {portalType === "CATEGORIES" && <CategoryPage/>}
      {portalType === "USERS" && <UserPage/>}
      {portalType === "ACCOUNT" && <AccountPage/>}
    </MainLayout>
  );
};

export default MainPrortal;
