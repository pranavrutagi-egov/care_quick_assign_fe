import { lazy } from "react";

const manifest = {
  // REQUIRED: unique plugin identifier
  plugin: "care_quick_assign",
  // Routes your plugin adds to the app (details in Section 4)
  routes: {},
  // Extensions (e.g., "DoctorConnectButtons", "PatientExternalRegistration")
  extends: [],
  // Pluggable components injected into host UI slots
  components: {},
  // Sidebar navigation items (facility context)
  navItems: [],
  // Admin panel sidebar items
  adminNavItems: [],
};

export default manifest;
