import Page from "@/components/ui/page";
import { I18NNAMESPACE } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/apis";
import {
  RefreshCwIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertCircleIcon,
} from "lucide-react";

interface FailedAssignmentEvent {
  id: string;
  patient: {
    id: string;
    name: string;
  };
  failure_reason: string | null;
  retry_count: number;
  triggered_at: string;
}

interface Props {
  facilityId: string;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function relativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function UnassignedPatients({ facilityId }: Props) {
  const { t } = useTranslation(I18NNAMESPACE);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const data = { results: [], count: 0 };
  const isLoading = false;

  // const { data, isLoading } = useQuery({
  //   queryKey: [
  //     "care-quick-assign",
  //     "failed-assignment-events",
  //     facilityId,
  //     page,
  //   ],
  //   queryFn: () =>
  //     apis.quick_assign_events.list(facilityId, {
  //       status: "FAILED",
  //       page,
  //       page_size: pageSize,
  //     }),
  //   enabled: !!facilityId,
  // });

  const events: FailedAssignmentEvent[] = data?.results ?? [];
  const totalCount: number = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // const { mutate: retryAssignment, isPending: isRetrying } = useMutation({
  //   mutationFn: (eventId: string) =>
  //     apis.quick_assign_events.retry(facilityId, eventId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["care-quick-assign", "failed-assignment-events", facilityId],
  //     });
  //   },
  // });

  const isRetrying = false;

  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetry = (eventId: string) => {
    setRetryingId(eventId);
    // retryAssignment(eventId, {
      // onSettled: () => setRetryingId(null),
    // });
  };

  if (isLoading) {
    return (
      <Page
        title={t("failed_assignments")}
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
      title={t("failed_assignments")}
      hideTitleOnPage
      className="p-0 care-quick-assign-container"
    >
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-1 sm:mb-2">
          <div>
            <h3>{t("failed_assignments")}</h3>
            <p className="text-gray-600 text-sm">
              {t("failed_assignments_description")}
            </p>
          </div>
        </div>

        <br />

        {events.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 border border-gray-200 bg-white shadow-sm">
            <AlertCircleIcon className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {t("no_failed_assignments")}
            </p>
          </Card>
        ) : (
          <>
            {/* Desktop table view */}
            <Card className="hidden md:block border border-gray-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium text-gray-600">
                      {t("patient")}
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">
                      {t("failure_reason")}
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">
                      {t("retries")}
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">
                      {t("triggered_at")}
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr
                      key={event.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === events.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {event.patient.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-red-600 max-w-xs truncate">
                          {event.failure_reason ?? (
                            <span className="text-gray-400">—</span>
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {event.retry_count > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <RefreshCwIcon className="h-3.5 w-3.5 text-gray-400" />
                            {event.retry_count}
                          </span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-gray-700"
                          title={formatDateTime(event.triggered_at)}
                        >
                          {relativeTime(event.triggered_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(event.id)}
                          disabled={isRetrying && retryingId === event.id}
                        >
                          <RefreshCwIcon
                            className={`h-4 w-4 ${
                              isRetrying && retryingId === event.id
                                ? "animate-spin"
                                : ""
                            }`}
                          />
                          {isRetrying && retryingId === event.id
                            ? t("retrying")
                            : t("retry")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Mobile card view */}
            <div className="flex flex-col gap-3 md:hidden">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="p-4 border border-gray-200 bg-white shadow-sm"
                >
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
                      onClick={() => handleRetry(event.id)}
                      disabled={isRetrying && retryingId === event.id}
                    >
                      <RefreshCwIcon
                        className={`h-4 w-4 ${
                          isRetrying && retryingId === event.id
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                      {isRetrying && retryingId === event.id
                        ? t("retrying")
                        : t("retry")}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <br />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {t("showing_results", {
                      from: (page - 1) * pageSize + 1,
                      to: Math.min(page * pageSize, totalCount),
                      total: totalCount,
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Page>
  );
}