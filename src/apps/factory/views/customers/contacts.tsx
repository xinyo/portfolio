import {
  EllipsisVertical,
  Mail,
  Phone,
  Plus,
  Search,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EditContactDialog } from "@/apps/factory/dialogs/edit-contact-dialog";
import {
  filterCustomerContacts,
  useFactoryStore,
  type FactoryCustomer,
  type FactoryCustomerContact,
} from "@/apps/factory/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type ContactsPanelProps = {
  customer: FactoryCustomer;
};

export function ContactsPanel({ customer }: ContactsPanelProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const archiveCustomerContact = useFactoryStore(
    (state) => state.archiveCustomerContact,
  );

  const contacts = filterCustomerContacts(customer.contacts, query);

  function handleAdd() {
    setEditingContactId(null);
    setContactDialogOpen(true);
  }

  function handleEdit(contactId: string) {
    setEditingContactId(contactId);
    setContactDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setEditingContactId(null);
    }
    setContactDialogOpen(open);
  }

  return (
    <section>
      <div className="factory-view-toolbar factory-contacts-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              placeholder={t(
                "factory.views.customerDetail.contacts.searchPlaceholder",
              )}
              aria-label={t(
                "factory.views.customerDetail.contacts.searchPlaceholder",
              )}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="size-4" />
          {t("factory.views.customerDetail.contacts.addContact")}
        </Button>
      </div>

      <div className="factory-product-list factory-contacts-list">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onArchive={() => archiveCustomerContact(customer.id, contact.id)}
              onEdit={() => handleEdit(contact.id)}
            />
          ))
        ) : (
          <p className="factory-detail-empty">
            {t("factory.views.customerDetail.contacts.empty")}
          </p>
        )}
      </div>

      <EditContactDialog
        open={contactDialogOpen}
        onOpenChange={handleDialogOpenChange}
        customerId={customer.id}
        contactId={editingContactId}
      />
    </section>
  );
}

function ContactItem({
  contact,
  onArchive,
  onEdit,
}: {
  contact: FactoryCustomerContact;
  onArchive: () => void;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
  const primaryPhone = contact.phone || contact.mobile;

  return (
    <Item variant="outline" size="default" className="factory-contact-item">
      <ItemMedia variant="image">
        <Avatar className="factory-contact-avatar">
          <AvatarImage src={contact.avatar} alt="" />
          <AvatarFallback>{getContactInitials(contact.contactName)}</AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className="factory-contact-primary">
        <ItemTitle>{contact.contactName}</ItemTitle>
        <ItemDescription>{primaryPhone || "-"}</ItemDescription>
      </ItemContent>

      {contact.email && (
        <ItemContent className="factory-contact-meta factory-contact-email">
          
          <ItemDescription >
            <span className="inline-flex items-center gap-2" aria-label="Email">
            <Mail className="size-4" /> {contact.email} 
            </span>
          </ItemDescription>
          <ItemDescription>
            <span className="inline-flex items-center gap-2" aria-label="Phone">
              {contact.mobile ? (
              <Smartphone className="size-4" />
            ) : (
              <Phone className="size-4" />
            )} {contact.mobile || contact.phone}
            </span>
          </ItemDescription>
        </ItemContent>
      )}


      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="More options">
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              {t("factory.views.customers.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onArchive}>
              {t("factory.views.customerDetail.contacts.archive")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}

function getContactInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
