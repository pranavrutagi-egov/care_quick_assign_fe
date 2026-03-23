import { useEffect } from "react";

export default function PatientRegistrationForm({
  form,
  facilityId,
}: {
  form: any;
  facilityId: string;
  patientId?: string;
  submitForm: () => void;
}) {
  useEffect(() => {
    if (facilityId) {
      form.setValue(
        "extensions",
        {
          ...form.getValues("extensions"),
          care_quick_assign: { registration_facility: facilityId },
        },
        { shouldDirty: true },
      );
    }
  }, [facilityId, form]);

  return null;
}
