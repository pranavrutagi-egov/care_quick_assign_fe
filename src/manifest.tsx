import { ShuffleIcon } from "lucide-react";
import routes from "@/routes";

const getBaseUrl = () => {
  const url = window.location.href;
  const match = url.match(/^(.*\/facility\/[0-9a-fA-F-]{36})/);
  const baseUrl = match ? match[1] : url;
  return baseUrl;
};

const manifest = {
  plugin: "care_quick_assign",
  routes: routes,
  extends: [],
  components: {},
  navItems: [
    {
      name: "Care Quick Assign",
      icon: <ShuffleIcon className="care-svg-icon__baseline" />,
      children: [
        // {
        //   name: "Failed Assignments",
        //   get url() {
        //     const baseUrl = getBaseUrl();
        //     return `${baseUrl}/care_quick_assign/failed_assignments`;
        //   },
        // },
        {
          name: "Quick Assign Config",
          get url() {
            const baseUrl = getBaseUrl();
            return `${baseUrl}/care_quick_assign/config`;
          },
        },
      ],
    },
  ],
};

export default manifest;
