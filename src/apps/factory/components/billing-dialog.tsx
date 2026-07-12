import { ArrowUpRight, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  factoryBilling,
  formatFactoryBillingAmount,
  formatFactoryBillingDate,
} from "@/apps/factory/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type BillingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type BillingEditButtonProps = {
  label: string;
};

function BillingEditButton({ label }: BillingEditButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="factory-billing-edit-button"
      aria-label={label}
      title={label}
    >
      <Pencil aria-hidden="true" />
    </Button>
  );
}

export function BillingDialog({ open, onOpenChange }: BillingDialogProps) {
  const { t } = useTranslation();
  const { plan, paymentMethod, billingEmail, billingAddress, invoices } =
    factoryBilling;
  const planPrice = formatFactoryBillingAmount(
    plan.priceCents,
    plan.currency,
  );
  const expiry = `${String(paymentMethod.expiryMonth).padStart(2, "0")}/${String(paymentMethod.expiryYear).slice(-2)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="factory-billing-dialog"
        closeLabel={t("factory.billingDialog.close")}
      >
        <DialogTitle className="sr-only">
          {t("factory.billingDialog.title")}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("factory.billingDialog.description")}
        </DialogDescription>

        <aside className="factory-billing-summary">
          <header className="factory-billing-panel-heading">
            <h2>{t("factory.billingDialog.title")}</h2>
            <p>{t("factory.billingDialog.summary")}</p>
          </header>

          <section
            className="factory-billing-plan"
            aria-labelledby="billing-plan-title"
          >
            <div className="factory-billing-plan-topline">
              <div>
                <span>{t("factory.billingDialog.plan.current")}</span>
                <h3 id="billing-plan-title">{plan.name}</h3>
              </div>
              <Badge variant="secondary">
                {t("factory.billingDialog.plan.active")}
              </Badge>
            </div>
            <p className="factory-billing-plan-price">
              <strong>{planPrice}</strong>
              <span>
                {t("factory.billingDialog.plan.interval", {
                  interval: plan.interval,
                })}
              </span>
            </p>
            <div className="factory-billing-plan-meta">
              <span>
                {t("factory.billingDialog.plan.seats", { count: plan.seats })}
              </span>
              <span>
                {t("factory.billingDialog.plan.renews", {
                  date: formatFactoryBillingDate(plan.renewalDate),
                })}
              </span>
            </div>
            <Button type="button" className="factory-billing-upgrade-button">
              {t("factory.billingDialog.plan.upgrade")}
              <ArrowUpRight aria-hidden="true" />
            </Button>
          </section>

          <section className="factory-billing-detail-section">
            <div className="factory-billing-detail-heading">
              <h3>{t("factory.billingDialog.payment.title")}</h3>
              <BillingEditButton
                label={t("factory.billingDialog.payment.edit")}
              />
            </div>
            <div
              className="factory-billing-card"
              role="img"
              aria-label={t("factory.billingDialog.payment.cardLabel", {
                brand: paymentMethod.brand,
                lastFour: paymentMethod.lastFour,
                expiry,
              })}
            >
              <div className="factory-billing-card-topline">
                <span className="factory-billing-card-chip" aria-hidden="true" />
                <strong className="factory-billing-card-brand">VISA</strong>
              </div>
              <p className="factory-billing-card-number">
                <span aria-hidden="true">••••</span>
                <span aria-hidden="true">••••</span>
                <span aria-hidden="true">••••</span>
                <strong>{paymentMethod.lastFour}</strong>
              </p>
              <div className="factory-billing-card-footer">
                <span>{paymentMethod.holderName}</span>
                <span>{expiry}</span>
              </div>
            </div>
          </section>

          <section className="factory-billing-detail-section">
            <div className="factory-billing-detail-heading">
              <h3>{t("factory.billingDialog.email.title")}</h3>
              <BillingEditButton label={t("factory.billingDialog.email.edit")} />
            </div>
            <p>{billingEmail}</p>
          </section>

          <section className="factory-billing-detail-section">
            <div className="factory-billing-detail-heading">
              <h3>{t("factory.billingDialog.address.title")}</h3>
              <BillingEditButton
                label={t("factory.billingDialog.address.edit")}
              />
            </div>
            <address>
              {billingAddress.line1}
              <br />
              {billingAddress.line2}
              <br />
              {billingAddress.country}
            </address>
          </section>
        </aside>

        <section className="factory-billing-invoices">
          <header className="factory-billing-panel-heading">
            <h2>{t("factory.billingDialog.invoices.title")}</h2>
            <p>{t("factory.billingDialog.invoices.description")}</p>
          </header>

          <Table className="factory-billing-invoice-table">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">
                  {t("factory.billingDialog.invoices.number")}
                </TableHead>
                <TableHead scope="col">
                  {t("factory.billingDialog.invoices.date")}
                </TableHead>
                <TableHead scope="col">
                  {t("factory.billingDialog.invoices.status")}
                </TableHead>
                <TableHead scope="col" className="factory-billing-amount">
                  {t("factory.billingDialog.invoices.amount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="factory-billing-invoice-number">
                    {invoice.number}
                  </TableCell>
                  <TableCell>
                    {formatFactoryBillingDate(invoice.issueDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="factory-billing-paid-badge"
                    >
                      {t(
                        `factory.billingDialog.invoices.statuses.${invoice.status}`,
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="factory-billing-amount">
                    {formatFactoryBillingAmount(
                      invoice.amountCents,
                      invoice.currency,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </DialogContent>
    </Dialog>
  );
}
