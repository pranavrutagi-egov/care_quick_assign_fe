import Page from "@/components/ui/page";
import { I18NNAMESPACE } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/apis";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { PencilIcon } from "lucide-react";

const assignmentConfigSchema = z.object({
  enabled: z.boolean(),
  max_patients_per_staff: z.number().min(1, "Must be at least 1"),
  max_patients_in_total: z.number().min(1, "Must be at least 1"),
  skill_weight: z.number().min(0),
  workload_weight: z.number().min(0),
  retry_attempts: z.number().min(0),
  window_size: z.number().min(1, "Must be at least 1"),
});

type AssignmentConfigForm = z.infer<typeof assignmentConfigSchema>;

interface Props {
  facilityId: string;
}

export default function QuickAssignConfig({ facilityId }: Props) {
  const { t } = useTranslation(I18NNAMESPACE);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const disabled = !isEditing;

  const { data, isLoading } = useQuery({
    queryKey: ["care-quick-assign", "assignment-config", facilityId],
    queryFn: () => apis.quick_assign_config.get(facilityId),
    enabled: !!facilityId,
  });

  const form = useForm<AssignmentConfigForm>({
    resolver: zodResolver(assignmentConfigSchema),
    defaultValues: {
      enabled: false,
      max_patients_per_staff: 1000,
      max_patients_in_total: 1000,
      skill_weight: 4,
      workload_weight: 5,
      retry_attempts: 0,
      window_size: 1,
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Saving data in form", data);
      form.reset({
        enabled: data.enabled,
        max_patients_per_staff: data.max_patients_per_staff,
        max_patients_in_total: data.max_patients_in_total,
        skill_weight: data.skill_weight,
        workload_weight: data.workload_weight,
        retry_attempts: data.retry_attempts,
        window_size: data.window_size,
      });
    }
  }, [data, form]);

  const { mutate: saveConfig, isPending } = useMutation({
    mutationFn: (formData: AssignmentConfigForm) =>
      apis.quick_assign_config.save({
        facility_id: facilityId,
        ...formData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["care-quick-assign", "assignment-config", facilityId],
      });
      setIsEditing(false);
    },
  });

  const onSubmit = (formData: AssignmentConfigForm) => {
    saveConfig(formData);
  };

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Page
        title={t("quick_assign_configuration")}
        hideTitleOnPage
        className="p-0 care-quick-assign-container"
      >
        <div className="container mx-auto flex items-center justify-center py-20">
          <p className="text-gray-500">{t("loading")}</p>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={t("quick_assign_configuration")}
      hideTitleOnPage
      className="p-0 care-quick-assign-container"
    >
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-1 sm:mb-2">
          <div>
            <h3>{t("quick_assign_configuration")}</h3>
            <p className="text-gray-600 text-sm">
              {t("quick_assign_configuration_description")}
            </p>
          </div>
          {disabled && (
            <Button
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon />
              {t("edit")}
            </Button>
          )}
        </div>

        <br />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={disabled ? "opacity-75 pointer-events-none" : ""}
          >
            <fieldset disabled={disabled}>
              <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h6 className="font-semibold text-gray-900">
                      {t("quick_assign_enabled")}
                    </h6>
                    <p className="text-sm text-gray-500">
                      {t("quick_assign_enabled_description")}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            enabled={field.value}
                            toggleHandler={() => field.onChange(!field.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <br />

              <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm gap-6">
                <div>
                  <h6 className="font-semibold text-gray-900">
                    {t("general_settings")}
                  </h6>
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
                        <FormField
                          control={form.control}
                          name="max_patients_per_staff"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Counter
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </Field>
                    </FieldSet>

                    <Separator />

                    <FieldSet className="flex-row gap-4 justify-between">
                      <div className="flex flex-col grow">
                        <FieldLegend>{t("max_patients_in_total")}</FieldLegend>
                        <FieldDescription>
                          {t("max_patients_in_total_description")}
                        </FieldDescription>
                      </div>
                      <Field className="w-auto">
                        <FormField
                          control={form.control}
                          name="max_patients_in_total"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Counter
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
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
                        <FormField
                          control={form.control}
                          name="window_size"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Counter
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
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
                        <FormField
                          control={form.control}
                          name="retry_attempts"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Counter
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </Field>
                    </FieldSet>
                  </FieldGroup>
                </div>
              </Card>

              <br />

              <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm gap-6">
                <div>
                  <h6 className="font-semibold text-gray-900">
                    {t("assignment_weights")}
                  </h6>
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
                        <FormField
                          control={form.control}
                          name="skill_weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Counter
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
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
                        <FormField
                          control={form.control}
                          name="workload_weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Counter
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </Field>
                    </FieldSet>
                  </FieldGroup>
                </div>
              </Card>
            </fieldset>

            <br />

            {!disabled && (
              <div className="flex items-center justify-end gap-3 pb-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="primary_gradient"
                  disabled={isPending || !form.formState.isDirty}
                >
                  {isPending ? t("saving") : t("save_changes")}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </Page>
  );
}
