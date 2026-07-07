import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFactoryStore, type FactoryCustomer } from "@/apps/factory/store";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CustomerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId?: string | null;
};

const AU_STATES = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
] as const;

const AVATAR_COUNT = 24;

function randomAvatar(): string {
  const n = Math.floor(Math.random() * AVATAR_COUNT) + 1;
  const padded = String(n).padStart(2, "0");
  return `/src/assets/customer/${padded}.webp`;
}

const EMPTY_FORM = {
  country: "Australia",
  name: "",
  abn: "",
  address: "",
  city: "",
  postCode: "",
  state: "",
};

export function CustomerDialog({
  open,
  onOpenChange,
  customerId,
}: CustomerDialogProps) {
  const { t } = useTranslation();
  const customers = useFactoryStore((s) => s.customers);
  const addCustomer = useFactoryStore((s) => s.addCustomer);
  const updateCustomer = useFactoryStore((s) => s.updateCustomer);

  const [country, setCountry] = useState(EMPTY_FORM.country);
  const [name, setName] = useState(EMPTY_FORM.name);
  const [abn, setAbn] = useState(EMPTY_FORM.abn);
  const [address, setAddress] = useState(EMPTY_FORM.address);
  const [city, setCity] = useState(EMPTY_FORM.city);
  const [postCode, setPostCode] = useState(EMPTY_FORM.postCode);
  const [state, setState] = useState(EMPTY_FORM.state);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const suppressUnsavedRef = useRef(false);

  const isEdit = customerId != null;

  // Populate form when editing an existing customer
  useEffect(() => {
    if (!open) return;
    if (customerId) {
      const existing = customers.find((c) => c.id === customerId);
      if (existing) {
        setCountry(existing.country);
        setName(existing.name);
        setAbn(existing.abn);
        setAddress(existing.address);
        setCity(existing.city);
        setPostCode(existing.postCode);
        setState(existing.state);
        return;
      }
    }
    // Create mode — reset
    setCountry(EMPTY_FORM.country);
    setName(EMPTY_FORM.name);
    setAbn(EMPTY_FORM.abn);
    setAddress(EMPTY_FORM.address);
    setCity(EMPTY_FORM.city);
    setPostCode(EMPTY_FORM.postCode);
    setState(EMPTY_FORM.state);
  }, [open, customerId, customers]);

  function hasChanges(): boolean {
    if (!isEdit) {
      return (
        country !== EMPTY_FORM.country ||
        name !== EMPTY_FORM.name ||
        abn !== EMPTY_FORM.abn ||
        address !== EMPTY_FORM.address ||
        city !== EMPTY_FORM.city ||
        postCode !== EMPTY_FORM.postCode ||
        state !== EMPTY_FORM.state
      );
    }
    const existing = customers.find((c) => c.id === customerId);
    if (!existing) return false;
    return (
      country !== existing.country ||
      name !== existing.name ||
      abn !== existing.abn ||
      address !== existing.address ||
      city !== existing.city ||
      postCode !== existing.postCode ||
      state !== existing.state
    );
  }

  function handleSubmit() {
    if (!name.trim()) return;

    if (isEdit) {
      updateCustomer(customerId!, {
        name: name.trim(),
        country,
        abn,
        address,
        city,
        postCode,
        state,
      });
    } else {
      const customer: FactoryCustomer = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        country,
        abn,
        address,
        city,
        postCode,
        state,
        image: randomAvatar(),
        contacts: [],
      };
      addCustomer(customer);
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
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t("factory.views.customers.editCustomer")
                : t("factory.views.customers.addCustomer")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cust-name">
                {t("factory.views.customers.customerName")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cust-name"
                placeholder={t("factory.views.customers.customerNameHint")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cust-abn">
                {t("factory.views.customers.abn")}
              </Label>
              <Input
                id="cust-abn"
                placeholder={t("factory.views.customers.abnHint")}
                value={abn}
                onChange={(e) => setAbn(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cust-country">
                {t("factory.views.customers.country")}
              </Label>
              <Input
                id="cust-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cust-address">
                {t("factory.views.customers.address")}
              </Label>
              <Input
                id="cust-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cust-city">
                {t("factory.views.customers.suburbCity")}
              </Label>
              <Input
                id="cust-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cust-postcode">
                {t("factory.views.customers.postCode")}
              </Label>
              <Input
                id="cust-postcode"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cust-state">
                {t("factory.views.customers.state")}
              </Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="cust-state" className="w-full">
                  <SelectValue
                    placeholder={t("factory.views.customers.selectState")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {AU_STATES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {t(`factory.views.customers.states.${st}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {t("factory.views.customers.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
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
