import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FactoryAvatarPicker } from "@/apps/factory/components/avatar-picker";
import {
  factoryAvatarOptions,
  useFactoryStore,
  type FactoryCustomerContact,
} from "@/apps/factory/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  contactId?: string | null;
};

const EMPTY_FORM = {
  contactName: "",
  email: "",
  phone: "",
  mobile: "",
  avatar: factoryAvatarOptions[0]?.src ?? "",
};

export function EditContactDialog({
  open,
  onOpenChange,
  customerId,
  contactId,
}: EditContactDialogProps) {
  const { t } = useTranslation();
  const customers = useFactoryStore((s) => s.customers);
  const addCustomerContact = useFactoryStore((s) => s.addCustomerContact);
  const updateCustomerContact = useFactoryStore((s) => s.updateCustomerContact);

  const [contactName, setContactName] = useState(EMPTY_FORM.contactName);
  const [email, setEmail] = useState(EMPTY_FORM.email);
  const [phone, setPhone] = useState(EMPTY_FORM.phone);
  const [mobile, setMobile] = useState(EMPTY_FORM.mobile);
  const [avatar, setAvatar] = useState(EMPTY_FORM.avatar);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const suppressUnsavedRef = useRef(false);

  const customer = customers.find((item) => item.id === customerId);
  const existingContact = customer?.contacts.find(
    (contact) => contact.id === contactId,
  );
  const isEdit = contactId != null;

  useEffect(() => {
    if (!open) return;
    if (existingContact) {
      setContactName(existingContact.contactName);
      setEmail(existingContact.email);
      setPhone(existingContact.phone);
      setMobile(existingContact.mobile);
      setAvatar(existingContact.avatar);
      return;
    }

    setContactName(EMPTY_FORM.contactName);
    setEmail(EMPTY_FORM.email);
    setPhone(EMPTY_FORM.phone);
    setMobile(EMPTY_FORM.mobile);
    setAvatar(EMPTY_FORM.avatar);
  }, [open, existingContact]);

  function hasChanges(): boolean {
    if (!isEdit) {
      return (
        contactName !== EMPTY_FORM.contactName ||
        email !== EMPTY_FORM.email ||
        phone !== EMPTY_FORM.phone ||
        mobile !== EMPTY_FORM.mobile ||
        avatar !== EMPTY_FORM.avatar
      );
    }

    if (!existingContact) return false;

    return (
      contactName !== existingContact.contactName ||
      email !== existingContact.email ||
      phone !== existingContact.phone ||
      mobile !== existingContact.mobile ||
      avatar !== existingContact.avatar
    );
  }

  function handleSubmit() {
    if (!contactName.trim()) return;

    const data = {
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      mobile: mobile.trim(),
      avatar,
    };

    if (isEdit && contactId) {
      updateCustomerContact(customerId, contactId, data);
    } else {
      const contact: FactoryCustomerContact = {
        id: `contact-${Date.now()}`,
        ...data,
        archived: false,
      };
      addCustomerContact(customerId, contact);
    }

    onOpenChange(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open && hasChanges()) {
      if (!suppressUnsavedRef.current) {
        suppressUnsavedRef.current = true;
        setShowUnsavedDialog(true);
        return;
      }
      suppressUnsavedRef.current = false;
      return;
    }
    suppressUnsavedRef.current = false;
    onOpenChange(open);
  }

  function handleUnsavedDiscard() {
    setShowUnsavedDialog(false);
    onOpenChange(false);
  }

  function handleUnsavedCancel() {
    setShowUnsavedDialog(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t("factory.views.customerDetail.contacts.editContact")
                : t("factory.views.customerDetail.contacts.addContact")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">
                {t("factory.views.customerDetail.contacts.contactName")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-name"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-email">
                {t("factory.views.customerDetail.contacts.email")}
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-phone">
                {t("factory.views.customerDetail.contacts.phone")}
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-mobile">
                {t("factory.views.customerDetail.contacts.mobile")}
              </Label>
              <Input
                id="contact-mobile"
                type="tel"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("factory.views.customerDetail.contacts.avatar")}</Label>
              <FactoryAvatarPicker
                value={avatar}
                onChange={setAvatar}
                ariaLabel={t("factory.views.customerDetail.contacts.avatar")}
                ariaLabelPrefix={t(
                  "factory.views.customerDetail.contacts.selectAvatar",
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {t("factory.views.customers.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={!contactName.trim()}>
              {isEdit
                ? t("factory.views.customers.save")
                : t("factory.views.customers.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("factory.views.customers.unsavedTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("factory.views.customers.unsavedDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleUnsavedCancel}>
              {t("factory.views.customers.keepEditing")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsavedDiscard}>
              {t("factory.views.customers.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
