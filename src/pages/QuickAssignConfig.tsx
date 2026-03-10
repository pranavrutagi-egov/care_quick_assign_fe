import { I18NNAMESPACE } from "@/lib/constants";
import { useTranslation } from "react-i18next";

interface Props {
  facilityId?: string;
}

export default function QuickAssignConfig({ facilityId }: Props) {
    const { t } = useTranslation(I18NNAMESPACE);

    return (
        <div>
            <h1>{t("quick_assign_config")}</h1>
            This is QuickAssignConfig Page for facility {facilityId}
        </div>
    )
}
