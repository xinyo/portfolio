import { Search } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  filterTimesheetEmployees,
  useFactoryStore,
  type FactoryEmployee,
} from "@/apps/factory/store";
import { resolveFactoryTimeZone } from "@/apps/factory/timesheet-date";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function TimesheetEmployeeSidebar() {
  const { t } = useTranslation();
  const employees = useFactoryStore((state) => state.employees);
  const timesheets = useFactoryStore((state) => state.timesheets);
  const timezone = useFactoryStore((state) => state.timezone);
  const filters = useFactoryStore((state) => state.timesheetFilters);
  const setTimesheetEmployeeQuery = useFactoryStore(
    (state) => state.setTimesheetEmployeeQuery,
  );
  const setTimesheetSelectedEmployeeId = useFactoryStore(
    (state) => state.setTimesheetSelectedEmployeeId,
  );

  const filteredEmployees = useMemo(
    () =>
      filterTimesheetEmployees(employees, timesheets, {
        dateRange: filters.dateRange,
        locationId: filters.locationId,
        employeeQuery: filters.employeeQuery,
        timeZone: resolveFactoryTimeZone(timezone),
      }),
    [
      employees,
      timesheets,
      filters.dateRange,
      filters.locationId,
      filters.employeeQuery,
      timezone,
    ],
  );

  function handleEmployeeSelect(employeeId: string) {
    setTimesheetSelectedEmployeeId(
      filters.selectedEmployeeId === employeeId ? null : employeeId,
    );
  }

  return (
    <section
      className="factory-timesheet-employee-sidebar"
      aria-label={t("factory.views.timesheets.employeeList")}
    >
      <div className="factory-search-input-wrapper factory-planner-search">
        <Search className="factory-search-input-icon" />
        <Input
          className="factory-search-input"
          value={filters.employeeQuery}
          onChange={(event) => setTimesheetEmployeeQuery(event.target.value)}
          placeholder={t("factory.views.timesheets.searchEmployees")}
          aria-label={t("factory.views.timesheets.searchEmployees")}
        />
      </div>

      <div className="factory-timesheet-employee-list" role="list">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <TimesheetEmployeeItem
              employee={employee}
              isSelected={filters.selectedEmployeeId === employee.id}
              key={employee.id}
              onSelect={() => handleEmployeeSelect(employee.id)}
            />
          ))
        ) : (
          <div className="factory-planner-empty">
            {t("factory.views.timesheets.noEmployees")}
          </div>
        )}
      </div>
    </section>
  );
}

function TimesheetEmployeeItem({
  employee,
  isSelected,
  onSelect,
}: {
  employee: FactoryEmployee;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Item
      asChild
      className="factory-timesheet-employee u-press flex-nowrap"
      variant="outline"
      size="sm"
      data-selected={isSelected}
    >
      <button
        type="button"
        role="listitem"
        aria-pressed={isSelected}
        onClick={onSelect}
      >
        <ItemMedia variant="image">
          <img src={employee.image} alt="" />
        </ItemMedia>
        <ItemContent className="truncate min-w-0">
          <ItemTitle title={employee.name}>{employee.name}</ItemTitle>
          <ItemDescription>{employee.accountType}</ItemDescription>
        </ItemContent>
      </button>
    </Item>
  );
}
