import Page from "@/components/ui/page";
import { I18NNAMESPACE } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/apis";
import {
  RefreshCwIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertCircleIcon,
} from "lucide-react";
import { formatDateTime, relativeTime } from "@/lib/utils";

interface Props {
  facilityId: string;
}

export default function FailedAssignments({ facilityId }: Props) {
  const { t } = useTranslation(I18NNAMESPACE);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "care-quick-assign",
      "failed-assignment-events",
      facilityId,
      page,
    ],
    queryFn: () => apis.quick_assignments.unassigned(facilityId, page),
    enabled: !!facilityId,
  });

  const events = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  const { mutate: retryAssignment, isPending: isRetrying } = useMutation({
    mutationFn: (patientId: string) =>
      apis.quick_assignments.retry(facilityId, patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["care-quick-assign", "failed-assignment-events", facilityId],
      });
    },
  });

  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetry = (patientId: string) => {
    setRetryingId(patientId);
    retryAssignment(patientId, {
      onSettled: () => setRetryingId(null),
    });
  };

  if (isLoading) {
    return (
      <Page
        title={t("failed_assignments")}
        hideTitleOnPage
        className="p-0 care-quick-assign-container"
      >
        <div className="container mx-auto">
          <div className="mb-8">
            <div className="space-y-2">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>

          {/* Desktop skeleton */}
          <div className="hidden md:block">
            <div className="rounded-lg border">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    {[120, 200, 60, 80, 80].map((w, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-4" style={{ width: w }} />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="divide-x">
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile skeleton */}
          <div className="flex flex-col gap-4 md:hidden">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex justify-between mb-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-full rounded mb-3" />
                <Separator className="mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={t("failed_assignments")}
      hideTitleOnPage
      className="p-0 care-quick-assign-container"
    >
      <div className="container mx-auto">
        <div className="mb-8">
          <h3>{t("failed_assignments")}</h3>
          <p className="text-gray-600 text-sm">
            {t("failed_assignments_description")}
          </p>
        </div>

        {events.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border border-dashed border-gray-300 bg-white py-16 px-8">
            <div className="rounded-full bg-gray-100 p-3">
              <AlertCircleIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-gray-900">
              {t("no_failed_assignments")}
            </h4>
            <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">
              {t("no_failed_assignments_description")}
            </p>
          </Card>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="flex flex-col gap-4 md:hidden">
              {events.map((event) => (
                <Card key={event.id}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.patient.name}
                        </p>
                        <p
                          className="text-xs text-gray-500 mt-0.5"
                          title={formatDateTime(event.triggered_at)}
                        >
                          {relativeTime(event.triggered_at)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border text-red-700 bg-red-50 border-red-200">
                        <XCircleIcon className="h-3.5 w-3.5" />
                        {t("status_failed")}
                      </span>
                    </div>

                    {event.failure_reason && (
                      <p className="text-xs text-red-600 mb-3 bg-red-50 rounded px-2 py-1.5">
                        {event.failure_reason}
                      </p>
                    )}

                    <Separator className="mb-3" />

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        {event.retry_count > 0 && (
                          <span className="text-gray-500 text-xs">
                            {t("retries")}: {event.retry_count}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(event.patient.id)}
                        disabled={isRetrying && retryingId === event.patient.id}
                      >
                        <RefreshCwIcon
                          className={`h-4 w-4 ${
                            isRetrying && retryingId === event.patient.id
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                        {isRetrying && retryingId === event.patient.id
                          ? t("retrying")
                          : t("retry")}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead>{t("patient_name")}</TableHead>
                      <TableHead>{t("failure_reason")}</TableHead>
                      <TableHead>{t("retries")}</TableHead>
                      <TableHead>{t("triggered_at")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white">
                    {events.map((event) => (
                      <TableRow key={event.id} className="divide-x">
                        <TableCell className="font-medium">
                          {event.patient.name}
                        </TableCell>
                        <TableCell className="text-red-600 max-w-80 whitespace-normal">
                          {event.failure_reason ?? (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-700">
                            {event.retry_count ?? 0}
                            &nbsp;
                            {event.retry_count > 1 ? "times" : "time"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-gray-700"
                            title={formatDateTime(event.triggered_at)}
                          >
                            {relativeTime(event.triggered_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(event.patient.id)}
                            disabled={
                              isRetrying && retryingId === event.patient.id
                            }
                          >
                            <RefreshCwIcon
                              className={`h-4 w-4 ${
                                isRetrying && retryingId === event.patient.id
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                            {isRetrying && retryingId === event.patient.id
                              ? t("retrying")
                              : t("retry")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {(hasNextPage || hasPreviousPage) && (
              <div className="flex items-center justify-between py-4">
                <p className="text-sm text-gray-500">
                  {t("showing_results", {
                    from: (page - 1) * 15 + 1,
                    to: Math.min(page * 15, totalCount),
                    total: totalCount,
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!hasPreviousPage}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    {t("page")} {page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}
