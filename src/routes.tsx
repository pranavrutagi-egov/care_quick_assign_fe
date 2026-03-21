import QuickAssignConfig from "@/pages/QuickAssignConfig";
import FailedAssignments from "@/pages/FailedAssignments";

const routes = {
  "/facility/:facilityId/care_quick_assign/config": ({
    facilityId,
  }: {
    facilityId: string;
  }) => <QuickAssignConfig facilityId={facilityId} />,

  "/facility/:facilityId/care_quick_assign/failed_assignments": ({
    facilityId,
  }: {
    facilityId: string;
  }) => {
    return <FailedAssignments facilityId={facilityId} />;
  },
};

export default routes;
