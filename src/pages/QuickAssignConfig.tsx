import Page from "@/components/ui/page";
import { I18NNAMESPACE } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Switch } from "@/components/custom/switch";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Counter } from "@/components/custom/counter";
import { useQuery } from "@tanstack/react-query";

interface Props {
  facilityId?: string;
}

export default function QuickAssignConfig({ facilityId }: Props) {
  const { t } = useTranslation(I18NNAMESPACE);

  const [enabled, setEnabled] = useState(true);
  const [maxPatients, setMaxPatients] = useState(5);
  const [skillWeight, setSkillWeight] = useState(1);
  const [workloadWeight, setWorkloadWeight] = useState(1);
  const [locationWeight, setLocationWeight] = useState(0);
  const [retryAttempts, setRetryAttempts] = useState(2);
  const [windowSize, setWindowSize] = useState(20);

  const onTogglingEnable = () => {
    setEnabled((state) => !state);
  };

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["care-quick-assign", "assignment-config", facilityId],
  //   queryFn: () => 
  // })

  // console.log(data, isLoading, error);

  return (
    <Page
      title={t("quick_assign_configuration")}
      hideTitleOnPage
      className="p-0 care-quick-assign-container"
    >
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-1 sm:mb-2">
          <h3>{t("quick_assign_configuration")}</h3>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-gray-600 text-sm">
              {t("quick_assign_configuration_description")}
            </p>
          </div>
          <div>
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors">
              {t("save_configuration")}
            </button>
          </div>
        </div>

        <br />

        <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 md:text-lg">
                {t("quick_assign_enabled")}
              </p>
              <p className="text-sm text-gray-500">
                {t("quick_assign_enabled_description")}
              </p>
            </div>

            <Switch enabled={enabled} toggleHandler={onTogglingEnable} />
          </div>
        </Card>

        <br />

        <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm gap-6">
          <div>
            <p className="font-semibold text-gray-900 md:text-lg">
              {t("general_settings")}
            </p>
            <p className="text-sm text-gray-500">
              {t("general_settings_description")}
            </p>
          </div>
          <Separator className="bg-gray-300" />
          <div>
            <FieldGroup>
              <FieldSet className="flex-row gap-4 justify-between">
                <div className="flex flex-col grow">
                  <FieldLegend>{t("max_patients_per_staff")}</FieldLegend>
                  <FieldDescription>
                    {t("max_patients_per_staff_description")}
                  </FieldDescription>
                </div>
                <Field className="w-auto">
                  <Counter value={maxPatients} onChange={setMaxPatients} />
                </Field>
              </FieldSet>

              <Separator />

              <FieldSet className="flex-row gap-4 justify-between">
                <div className="flex flex-col grow">
                  <FieldLegend>{t("window_size")}</FieldLegend>
                  <FieldDescription>
                    {t("window_size_description")}
                  </FieldDescription>
                </div>
                <Field className="w-auto">
                  <Counter value={windowSize} onChange={setWindowSize} />
                </Field>
              </FieldSet>

              <Separator />

              <FieldSet className="flex-row gap-4 justify-between">
                <div className="flex flex-col grow">
                  <FieldLegend>{t("retry_attempts")}</FieldLegend>
                  <FieldDescription>
                    {t("retry_attempts_description")}
                  </FieldDescription>
                </div>
                <Field className="w-auto">
                  <Counter value={retryAttempts} onChange={setRetryAttempts} />
                </Field>
              </FieldSet>
            </FieldGroup>
          </div>
        </Card>

        <br />

        <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm gap-6">
          <div>
            <p className="font-semibold text-gray-900 md:text-lg">
              {t("assignment_weights")}
            </p>
            <p className="text-sm text-gray-500">
              {t("assignment_weights_description")}
            </p>
          </div>

          <Separator className="bg-gray-300" />

          <div>
            <FieldGroup>
              <FieldSet className="flex-row gap-4 justify-between">
                <div className="flex flex-col grow">
                  <FieldLegend>{t("skill_weight")}</FieldLegend>
                  <FieldDescription>
                    {t("skill_weight_description")}
                  </FieldDescription>
                </div>
                <Field className="w-auto">
                  <Counter value={skillWeight} onChange={setSkillWeight} />
                </Field>
              </FieldSet>

              <Separator />

              <FieldSet className="flex-row gap-4 justify-between">
                <div className="flex flex-col grow">
                  <FieldLegend>{t("workload_weight")}</FieldLegend>
                  <FieldDescription>
                    {t("workload_weight_description")}
                  </FieldDescription>
                </div>
                <Field className="w-auto">
                  <Counter
                    value={workloadWeight}
                    onChange={setWorkloadWeight}
                  />
                </Field>
              </FieldSet>

              <Separator />

              <FieldSet className="flex-row gap-4 justify-between">
                <div className="flex flex-col grow">
                  <FieldLegend>{t("location_weight")}</FieldLegend>
                  <FieldDescription>
                    {t("location_weight_description")}
                  </FieldDescription>
                </div>
                <Field className="w-auto">
                  <Counter
                    value={locationWeight}
                    onChange={setLocationWeight}
                  />
                </Field>
              </FieldSet>
            </FieldGroup>
          </div>
        </Card>

        <br />

        {/* Save / Cancel Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            {t("cancel")}
          </button>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors">
            {t("save_configuration")}
          </button>
        </div>
      </div>
    </Page>
  );
}
