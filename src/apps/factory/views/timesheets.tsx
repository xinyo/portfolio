import { CalendarIcon, MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  filterTimesheets,
  getTimesheetStatusVariant,
  useFactoryStore,
  type FactoryTimesheet,
} from "@/apps/factory/store";
import {
  calendarRangeToTimesheetRange,
  getCurrentMonthRange,
  resolveFactoryTimeZone,
  timesheetRangeToCalendarRange,
  type FactoryTimesheetDateRange,
} from "@/apps/factory/timesheet-date";
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

function formatDateRangeLabel(
  range: FactoryTimesheetDateRange,
  fallback: string,
) {
  const formatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  } as const;

  if (range.from && range.to) {
    return `${range.from.toLocaleString(undefined, formatOptions)} – ${range.to.toLocaleString(undefined, formatOptions)}`;
  }

  if (range.from) {
    return range.from.toLocaleString(undefined, formatOptions);
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
  const timezone = useFactoryStore((state) => state.timezone);
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

    setTimesheetDateRange(getCurrentMonthRange(timezone));
  }, [
    filters.dateRange.from,
    filters.dateRange.to,
    setTimesheetDateRange,
    timezone,
  ]);

  const resolvedTimeZone = useMemo(
    () => resolveFactoryTimeZone(timezone),
    [timezone],
  );

  const filteredTimesheets = useMemo(
    () =>
      filterTimesheets(timesheets, {
        dateRange: filters.dateRange,
        locationId: filters.locationId,
        selectedEmployeeId: filters.selectedEmployeeId,
        timeZone: resolvedTimeZone,
      }),
    [
      timesheets,
      filters.dateRange,
      filters.locationId,
      filters.selectedEmployeeId,
      resolvedTimeZone,
    ],
  );

  const selectedRange = timesheetRangeToCalendarRange(filters.dateRange);

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
                setTimesheetDateRange(calendarRangeToTimesheetRange(range))
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
              employee={employeesById[timesheet.empId] ?? null}
              timesheet={timesheet}
              timeZone={resolvedTimeZone}
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
  employee,
  timesheet,
  timeZone,
}: {
  employee: { image: string; name: string } | null;
  timesheet: FactoryTimesheet;
  timeZone: string;
}) {
  const { t } = useTranslation();
  const statusVariant = getTimesheetStatusVariant(timesheet.status);
  const employeeName = employee?.name ?? t("factory.views.timesheets.unknownEmployee");

  return (
    <Item
      className="factory-timesheet-item"
      variant="outline"
      data-status={statusVariant}
    >
      <ItemContent>
        <ItemTitle>
          {employee && (
            <span className="factory-timesheet-employee-avatar">
              <img src={employee.image} alt="" />
            </span>
          )}
          {employeeName}
        </ItemTitle>
        <ItemDescription>{timesheet.comments[0] ?? timesheet.id}</ItemDescription>
      </ItemContent>
      <ItemActions className="factory-timesheet-item-actions">
        <Badge className="factory-timesheet-status-tag" data-status={statusVariant}>
          {timesheet.status}
        </Badge>
        <TimesheetDateTimeBlock
          startTime={timesheet.startTime}
          endTime={timesheet.endTime}
          timeZone={timeZone}
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
  timeZone,
  dateLabel,
  timeLabel,
}: {
  startTime: string;
  endTime: string;
  timeZone: string;
  dateLabel: string;
  timeLabel: string;
}) {
  const startDate = useFormattedTemporalDate(startTime, {
    absoluteFormat: {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
    timeZone,
    updateIntervalMs: 60000,
  });
  const startTimeFormatted = useFormattedTemporalDate(startTime, {
    absoluteFormat: {
      hour: "numeric",
      minute: "2-digit",
    },
    timeZone,
    updateIntervalMs: 60000,
  });
  const endTimeFormatted = useFormattedTemporalDate(endTime, {
    absoluteFormat: {
      hour: "numeric",
      minute: "2-digit",
    },
    timeZone,
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
