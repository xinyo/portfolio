import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useFactoryStore, type FactoryCustomer } from "@/apps/factory/store";
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
};

const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

const AVATAR_COUNT = 24;

function randomAvatar(): string {
  const n = Math.floor(Math.random() * AVATAR_COUNT) + 1;
  const padded = String(n).padStart(2, "0");
  return `/src/assets/avatar/agent_avatar_${padded}.svg`;
}

export function CustomerDialog({ open, onOpenChange }: CustomerDialogProps) {
  const { t } = useTranslation();
  const addCustomer = useFactoryStore((s) => s.addCustomer);

  const [country, setCountry] = useState("Australia");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [abn, setAbn] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");
  const [state, setState] = useState("");

  function handleCreate() {
    if (!name.trim()) return;

    const customer: FactoryCustomer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      country,
      phone,
      abn,
      address,
      city,
      postCode,
      state,
      image: randomAvatar(),
    };

    addCustomer(customer);
    resetForm();
    onOpenChange(false);
  }

  function resetForm() {
    setCountry("Australia");
    setName("");
    setPhone("");
    setAbn("");
    setAddress("");
    setCity("");
    setPostCode("");
    setState("");
  }

  function handleOpenChange(open: boolean) {
    if (!open) resetForm();
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("factory.views.customers.addCustomer")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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
            <Label htmlFor="cust-name">
              {t("factory.views.customers.customerName")}
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
            <Label htmlFor="cust-phone">
              {t("factory.views.customers.phone")}
            </Label>
            <Input
              id="cust-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          <Button onClick={handleCreate} disabled={!name.trim()}>
            {t("factory.views.customers.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
