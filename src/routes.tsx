import QuickAssignConfig from "@/pages/QuickAssignConfig";
// import UnassignedPatients from "./pages/UnassignedPatients";

const routes = {
  "/facility/:facilityId/care_quick_assign/config": ({
    facilityId,
  }: {
    facilityId: string;
  }) => <QuickAssignConfig facilityId={facilityId} />,

  // "/facility/:facilityId/care_quick_assign/failed_assignments": ({
  //   facilityId,
  // }: {
  //   facilityId: string;
  // }) => {
  //   return <UnassignedPatients facilityId={facilityId} />;
  // },
};

export default routes;
