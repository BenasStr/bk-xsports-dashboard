import MainLayout from "./MainLayout";
import SamplePage from "./samplepage/SamplePage";
import SportPage from "./sportPage/SportPage"

type PortalType = "SPORTS" | "SAMPLE" | "?";

interface Props {
  portalType: PortalType;
}

const MainProtal: React.FunctionComponent<React.PropsWithChildren<Props>> = ({
  portalType,
  children,
}) => {
  console.log("Render", portalType);
  return (
    <MainLayout>
      {portalType === "?" && <>?</>}
      {portalType === "SAMPLE" && <SamplePage />}
      {portalType === "SPORTS" && <SportPage/>}
    </MainLayout>
  );
};

export default MainProtal;
