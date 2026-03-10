import QuickAssignConfig from "@/pages/QuickAssignConfig";

const routes = {
  "/facility/:facilityId/care_quick_assign/config": ({ facilityId }: { facilityId: string }) => (
    <QuickAssignConfig facilityId={facilityId} />
  ),
};

export default routes;