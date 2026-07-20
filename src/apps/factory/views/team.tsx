import { EllipsisVertical, Mail, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditEmployeeDialog } from "@/apps/factory/dialogs/edit-employee-dialog";
import { useFactoryListQuery } from "@/apps/factory/hooks/use-factory-list-query";
import { filterTeamMembers, useFactoryStore } from "@/apps/factory/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function TeamView() {
  const { t } = useTranslation();
  const [query, setQuery] = useFactoryListQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null,
  );
  const user = useFactoryStore((state) => state.user);
  const employees = useFactoryStore((state) => state.employees);
  const archiveEmployee = useFactoryStore((state) => state.archiveEmployee);

  const filteredEmployees = filterTeamMembers(employees, query);

  const normalizedQuery = query.trim().toLowerCase();

  const userMatchesQuery = useMemo(() => {
    if (!normalizedQuery) return true;
    return [user.name, user.email, user.accountType].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, user.name, user.email, user.accountType]);

  function handleAdd() {
    setEditingEmployeeId(null);
    setDialogOpen(true);
  }

  function handleEdit(employeeId: string) {
    setEditingEmployeeId(employeeId);
    setDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setEditingEmployeeId(null);
    }
    setDialogOpen(open);
  }

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.team.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.team.subtitle")}
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="size-4" />
          {t("factory.views.team.addEmployee")}
        </Button>
      </div>

      <div className="factory-view-toolbar factory-team-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              placeholder={t("factory.views.team.searchPlaceholder")}
              aria-label={t("factory.views.team.searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="factory-product-list factory-team-list">
        {/* Current user row — no delete */}
        {userMatchesQuery && (
          <TeamMemberItem
            member={{
              id: user.id,
              name: user.name,
              email: user.email,
              accountType: user.accountType,
              image: user.avatar,
            }}
            isCurrentUser
            onEdit={() => handleEdit(user.id)}
          />
        )}

        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <TeamMemberItem
              key={employee.id}
              member={employee}
              onArchive={() => archiveEmployee(employee.id)}
              onEdit={() => handleEdit(employee.id)}
            />
          ))
        ) : (
          <p className="factory-detail-empty">
            {t(
              userMatchesQuery
                ? "factory.views.team.noResults"
                : "factory.views.team.empty",
            )}
          </p>
        )}
      </div>

      <EditEmployeeDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        employeeId={editingEmployeeId}
      />
    </section>
  );
}

function TeamMemberItem({
  member,
  isCurrentUser = false,
  onArchive,
  onEdit,
}: {
  member: {
    id: string;
    name: string;
    email: string;
    accountType: string;
    image: string;
  };
  isCurrentUser?: boolean;
  onArchive?: () => void;
  onEdit: () => void;
}) {
  return (
    <Item variant="outline" size="default" className="factory-team-item">
      <ItemMedia variant="image">
        <Avatar className="factory-contact-avatar">
          <AvatarImage src={member.image} alt="" />
          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className="factory-contact-primary">
        <ItemTitle>
          {member.name}
          {isCurrentUser && (
            <Badge variant="secondary" className="ml-2">
              You
            </Badge>
          )}
        </ItemTitle>
        <ItemDescription>
          <span className="inline-flex items-center gap-2">
            {member.accountType}
          </span>
        </ItemDescription>
      </ItemContent>

      <ItemContent className="factory-contact-meta factory-contact-email">
        <ItemDescription>
          <span className="inline-flex items-center gap-2" aria-label="Email">
            <Mail className="size-4" /> {member.email}
          </span>
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="More options">
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            {!isCurrentUser && onArchive && (
              <DropdownMenuItem variant="destructive" onClick={onArchive}>
                Remove
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
