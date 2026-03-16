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
import { PencilIcon, SettingsIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const assignmentConfigSchema = z.object({
  enabled: z.boolean(),
  max_patients_per_staff: z.number().min(1, "Must be at least 1"),
  max_patients_in_total: z.number().min(1, "Must be at least 1"),
  skill_weight: z.number().min(0),
  workload_weight: z.number().min(0),
  max_retry_attempts: z.number().min(0),
  window_size: z.number().min(1, "Must be at least 1"),
});

type AssignmentConfigForm = z.infer<typeof assignmentConfigSchema>;

function LoadingSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-1 sm:mb-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      <br />

      <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </Card>

      <br />

      <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Separator className="bg-gray-300" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        ))}
      </Card>

      <br />

      <Card className="flex flex-col justify-center p-8 border border-gray-200 bg-white shadow-sm gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Separator className="bg-gray-300" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        ))}
      </Card>
    </div>
  );
}

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

  const isConfigured = data?.configured ?? false;

  const form = useForm<AssignmentConfigForm>({
    resolver: zodResolver(assignmentConfigSchema),
    defaultValues: {
      enabled: false,
      max_patients_per_staff: 1000,
      max_patients_in_total: 1000,
      skill_weight: 4,
      workload_weight: 5,
      max_retry_attempts: 0,
      window_size: 1,
    },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset({
        enabled: data.data.enabled,
        max_patients_per_staff: data.data.max_patients_per_staff,
        max_patients_in_total: data.data.max_patients_in_total,
        skill_weight: data.data.skill_weight,
        workload_weight: data.data.workload_weight,
        max_retry_attempts: data.data.max_retry_attempts,
        window_size: data.data.window_size,
      });
    }
  }, [data?.data, form]);

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
        <LoadingSkeleton />
      </Page>
    );
  }

  if (isConfigured === false && isEditing === false) {
    return (
      <Page
        title={t("quick_assign_configuration")}
        hideTitleOnPage
        className="p-0 care-quick-assign-container"
      >
        <div className="container mx-auto">
          <div className="mb-1 sm:mb-2">
            <h3>{t("quick_assign_configuration")}</h3>
            <p className="text-gray-600 text-sm">
              {t("quick_assign_configuration_description")}
            </p>
          </div>

          <br />

          <Card className="flex flex-col items-center justify-center border border-dashed border-gray-300 bg-white py-16 px-8">
            <div className="rounded-full bg-gray-100 p-3">
              <SettingsIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-gray-900">
              {t("no_config_set")}
            </h4>
            <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">
              {t("no_config_set_description")}
            </p>
            <Button
              className="mt-5"
              variant="primary_gradient"
              onClick={() => setIsEditing(true)}
            >
              {t("create_configuration")}
            </Button>
          </Card>
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
            <Button onClick={() => setIsEditing(true)}>
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
                        <FieldLegend>{t("max_retry_attempts")}</FieldLegend>
                        <FieldDescription>
                          {t("max_retry_attempts_description")}
                        </FieldDescription>
                      </div>
                      <Field className="w-auto">
                        <FormField
                          control={form.control}
                          name="max_retry_attempts"
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
                                  min={1}
                                  max={5}
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
                                  min={1}
                                  max={5}
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
