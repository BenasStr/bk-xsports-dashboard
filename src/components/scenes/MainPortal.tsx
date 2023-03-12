import CategoryPage from "./categoryPage/CategoryPage";
import MainLayout from "./MainLayout";
import SamplePage from "./samplepage/SamplePage";
import SportPage from "./sportPage/SportPage"

type PortalType = "SPORTS" | "SAMPLE" | "CATEGORIES" | "?";

interface Props {
  portalType: PortalType;
}

const MainPrortal: React.FunctionComponent<React.PropsWithChildren<Props>> = ({
  portalType,
  children,
}) => {
  console.log("Render", portalType);
  return (
    <MainLayout>
      {portalType === "?" && <>?</>}
      {portalType === "SAMPLE" && <SamplePage />}
      {portalType === "SPORTS" && <SportPage/>}
      {portalType === "CATEGORIES" && <CategoryPage/>}
    </MainLayout>
  );
};

export default MainPrortal;
