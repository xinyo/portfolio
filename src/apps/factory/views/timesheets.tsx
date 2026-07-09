import type { DateRange } from "react-day-picker";
import { CalendarIcon, MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  filterTimesheets,
  getTimesheetStatusVariant,
  useFactoryStore,
  type FactoryTimesheet,
} from "@/apps/factory/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormattedTemporalDate } from "@/hooks/use-Instant";

function getCurrentLocalWeekRange() {
  const today = new Date();
  const day = today.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  const from = new Date(today);
  from.setDate(today.getDate() - daysSinceMonday);
  from.setHours(0, 0, 0, 0);

  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

function formatDateRangeLabel(
  range: { from: Date | null; to: Date | null },
  fallback: string,
) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (range.from && range.to) {
    return `${formatter.format(range.from)} – ${formatter.format(range.to)}`;
  }

  if (range.from) {
    return formatter.format(range.from);
  }

  return fallback;
}

export function TimesheetsView() {
  const { t } = useTranslation();
  const employeesById = useFactoryStore(
    (state) => state.timesheetIndexes.employeesById,
  );
  const locations = useFactoryStore((state) => state.locations);
  const timesheets = useFactoryStore((state) => state.timesheets);
  const filters = useFactoryStore((state) => state.timesheetFilters);
  const setTimesheetDateRange = useFactoryStore(
    (state) => state.setTimesheetDateRange,
  );
  const setTimesheetLocationId = useFactoryStore(
    (state) => state.setTimesheetLocationId,
  );

  useEffect(() => {
    if (filters.dateRange.from || filters.dateRange.to) {
      return;
    }

    setTimesheetDateRange(getCurrentLocalWeekRange());
  }, [filters.dateRange.from, filters.dateRange.to, setTimesheetDateRange]);

  const filteredTimesheets = useMemo(
    () =>
      filterTimesheets(timesheets, {
        dateRange: filters.dateRange,
        locationId: filters.locationId,
        selectedEmployeeId: filters.selectedEmployeeId,
      }),
    [
      timesheets,
      filters.dateRange,
      filters.locationId,
      filters.selectedEmployeeId,
    ],
  );

  const selectedRange: DateRange | undefined = filters.dateRange.from
    ? {
        from: filters.dateRange.from,
        to: filters.dateRange.to ?? undefined,
      }
    : undefined;

  return (
    <section className="factory-view factory-timesheets-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.timesheets.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.timesheets.subtitle")}
          </p>
        </div>
      </div>

      <div className="factory-timesheets-toolbar">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="factory-timesheets-date-trigger"
            >
              <CalendarIcon className="size-4" />
              {formatDateRangeLabel(
                filters.dateRange,
                t("factory.views.timesheets.selectDateRange"),
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={(range) =>
                setTimesheetDateRange({
                  from: range?.from ?? null,
                  to: range?.to ?? null,
                })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select
          value={filters.locationId}
          onValueChange={setTimesheetLocationId}
        >
          <SelectTrigger className="factory-timesheets-location-trigger">
            <MapPin className="size-4 text-muted-foreground" />
            <SelectValue
              placeholder={t("factory.views.timesheets.selectLocation")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("factory.views.timesheets.allLocations")}
            </SelectItem>
            {locations.map((location) => (
              <SelectItem value={location.id} key={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ItemGroup className="factory-timesheet-list">
        {filteredTimesheets.length > 0 ? (
          filteredTimesheets.map((timesheet) => (
            <TimesheetItem
              employeeName={
                employeesById[timesheet.empId]?.name ??
                t("factory.views.timesheets.unknownEmployee")
              }
              timesheet={timesheet}
              key={timesheet.id}
            />
          ))
        ) : (
          <div className="factory-timesheet-empty">
            {t("factory.views.timesheets.noTimesheets")}
          </div>
        )}
      </ItemGroup>
    </section>
  );
}

function TimesheetItem({
  employeeName,
  timesheet,
}: {
  employeeName: string;
  timesheet: FactoryTimesheet;
}) {
  const { t } = useTranslation();
  const statusVariant = getTimesheetStatusVariant(timesheet.status);

  return (
    <Item
      className="factory-timesheet-item"
      variant="outline"
      data-status={statusVariant}
    >
      <ItemContent>
        <ItemTitle>{employeeName}</ItemTitle>
        <ItemDescription>{timesheet.comments[0] ?? timesheet.id}</ItemDescription>
      </ItemContent>
      <ItemActions className="factory-timesheet-item-actions">
        <Badge className="factory-timesheet-status-tag" data-status={statusVariant}>
          {timesheet.status}
        </Badge>
        <TimesheetDateTimeBlock
          startTime={timesheet.startTime}
          endTime={timesheet.endTime}
          dateLabel={t("factory.views.timesheets.dateLabel")}
          timeLabel={t("factory.views.timesheets.timeLabel")}
        />
      </ItemActions>
    </Item>
  );
}

function TimesheetDateTimeBlock({
  startTime,
  endTime,
  dateLabel,
  timeLabel,
}: {
  startTime: string;
  endTime: string;
  dateLabel: string;
  timeLabel: string;
}) {
  const startDate = useFormattedTemporalDate(startTime, {
    absoluteFormat: {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
    updateIntervalMs: 60000,
  });
  const startTimeFormatted = useFormattedTemporalDate(startTime, {
    absoluteFormat: {
      hour: "numeric",
      minute: "2-digit",
    },
    updateIntervalMs: 60000,
  });
  const endTimeFormatted = useFormattedTemporalDate(endTime, {
    absoluteFormat: {
      hour: "numeric",
      minute: "2-digit",
    },
    updateIntervalMs: 60000,
  });

  return (
    <div className="factory-timesheet-date-time">
      <span aria-label={dateLabel}>{startDate?.absolute ?? "—"}</span>
      <span aria-label={timeLabel}>
        {startTimeFormatted?.absolute ?? "—"} – {endTimeFormatted?.absolute ?? "—"}
      </span>
    </div>
  );
}
