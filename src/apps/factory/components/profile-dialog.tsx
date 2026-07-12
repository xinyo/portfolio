import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Apple,
  Bell,
  Braces,
  Check,
  Copy,
  KeyRound,
  RectangleEllipsis,
  Lock,
  Mail,
  Pencil,
  Plug,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { FactoryAvatarPicker } from "@/apps/factory/components/avatar-picker";
import { removeFactoryCustomCompany } from "@/apps/factory/onboarding";
import {
  createFactoryApiKey,
  joinFactoryUserName,
  splitFactoryUserName,
} from "@/apps/factory/profile";
import {
  factoryApiKeys,
  factoryAppearanceOptions,
  factoryLanguageOptions,
  factoryLocations,
  factoryTimezoneOptions,
  useFactoryStore,
  type FactoryApiKey,
  type FactoryAppearance,
  type FactoryLanguage,
  type FactoryTimezone,
  type FactoryUser,
} from "@/apps/factory/store";
import { useTheme } from "@/hooks/use-theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ProfileTab = "account" | "security" | "notifications" | "apiKeys";
type ProfilePanel = ProfileTab | "avatar";

type AccountDraft = {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  language: FactoryLanguage;
  timezone: FactoryTimezone;
  appearance: FactoryAppearance;
  keyboardShortcuts: boolean;
};

function getAccountDraft(user: FactoryUser): AccountDraft {
  const { firstName, lastName } = splitFactoryUserName(user.name);

  return {
    firstName,
    lastName,
    email: user.email,
    location: user.location,
    language: user.language,
    timezone: user.timezone,
    appearance: user.appearance,
    keyboardShortcuts: user.keyboardShortcuts,
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const user = useFactoryStore((state) => state.user);
  const updateUserProfile = useFactoryStore((state) => state.updateUserProfile);
  const clearCustomCompany = useFactoryStore(
    (state) => state.clearCustomCompany,
  );
  const { setIsDark } = useTheme(false);
  const { t } = useTranslation();
  const [activePanel, setActivePanel] = useState<ProfilePanel>("account");
  const profileTabs = useMemo<
    Array<{ id: ProfileTab; label: string; icon: LucideIcon }>
  >(
    () => [
      {
        id: "account",
        label: t("factory.profileDialog.tabs.account"),
        icon: User,
      },
      {
        id: "security",
        label: t("factory.profileDialog.tabs.security"),
        icon: ShieldCheck,
      },
      {
        id: "notifications",
        label: t("factory.profileDialog.tabs.notifications"),
        icon: Bell,
      },
      {
        id: "apiKeys",
        label: t("factory.profileDialog.tabs.apiKeys"),
        icon: Braces,
      },
    ],
    [t],
  );
  const notificationOptions = useMemo(
    () => [
      {
        id: "email",
        title: t("factory.profileDialog.notifications.email"),
        description: t("factory.profileDialog.notifications.emailDesc"),
      },
      {
        id: "security",
        title: t("factory.profileDialog.notifications.securityAlerts"),
        description: t(
          "factory.profileDialog.notifications.securityAlertsDesc",
        ),
      },
      {
        id: "workflow",
        title: t("factory.profileDialog.notifications.workflowChanges"),
        description: t(
          "factory.profileDialog.notifications.workflowChangesDesc",
        ),
      },
      {
        id: "summary",
        title: t("factory.profileDialog.notifications.weeklySummaries"),
        description: t(
          "factory.profileDialog.notifications.weeklySummariesDesc",
        ),
      },
      {
        id: "product",
        title: t("factory.profileDialog.notifications.productUpdates"),
        description: t(
          "factory.profileDialog.notifications.productUpdatesDesc",
        ),
      },
    ],
    [t],
  );
  const [accountDraft, setAccountDraft] = useState(() => getAccountDraft(user));
  const [avatarDraft, setAvatarDraft] = useState(user.avatar);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true,
    security: true,
    workflow: true,
    summary: false,
    product: false,
  });
  const [apiKeys, setApiKeys] = useState<FactoryApiKey[]>(factoryApiKeys);
  const [apiKeyName, setApiKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isApiKeyPopoverOpen, setIsApiKeyPopoverOpen] = useState(false);
  const [isGeneratedKeyCopied, setIsGeneratedKeyCopied] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setAccountDraft(getAccountDraft(user));
    setAvatarDraft(user.avatar);
  }, [open, user]);

  const activeTab = activePanel === "avatar" ? null : activePanel;
  const accountName = useMemo(
    () =>
      joinFactoryUserName({
        firstName: accountDraft.firstName,
        lastName: accountDraft.lastName,
      }),
    [accountDraft.firstName, accountDraft.lastName],
  );

  function updateAccountDraft<T extends keyof AccountDraft>(
    key: T,
    value: AccountDraft[T],
  ) {
    setAccountDraft((draft) => ({ ...draft, [key]: value }));
  }

  function handleAccountSave() {
    updateUserProfile({
      name: accountName || user.name,
      email: accountDraft.email,
      location: accountDraft.location,
      language: accountDraft.language,
      timezone: accountDraft.timezone,
      appearance: accountDraft.appearance,
      keyboardShortcuts: accountDraft.keyboardShortcuts,
    });

    if (accountDraft.appearance === "Dark") {
      setIsDark(true);
    } else if (accountDraft.appearance === "Light") {
      setIsDark(false);
    }

    toast.success(t("factory.profileDialog.actions.profileSaved"));
  }

  function handleDeleteAccount() {
    removeFactoryCustomCompany();
    onOpenChange(false);
    clearCustomCompany();
  }

  function handleAvatarSave() {
    updateUserProfile({ avatar: avatarDraft });
    toast.success(t("factory.profileDialog.actions.avatarSaved"));
  }

  function handleGenerateApiKey() {
    const apiKey = createFactoryApiKey(apiKeyName);

    if (!apiKey) {
      return;
    }

    setApiKeys((keys) => [
      ...keys,
      { id: apiKey.id, name: apiKey.name, maskedKey: apiKey.maskedKey },
    ]);
    setGeneratedKey(apiKey.value);
    setIsGeneratedKeyCopied(false);
    setApiKeyName("");
  }

  function handleApiKeyPopoverOpenChange(isOpen: boolean) {
    setIsApiKeyPopoverOpen(isOpen);

    if (!isOpen) {
      setApiKeyName("");
      setGeneratedKey(null);
      setIsGeneratedKeyCopied(false);
    }
  }

  function handlePasswordAction() {
    if (!isPasswordFormOpen) {
      setIsPasswordFormOpen(true);
      return;
    }

    toast.success(t("factory.profileDialog.actions.passwordSaved"));
  }

  async function handleCopyGeneratedKey(value: string) {
    try {
      await navigator.clipboard?.writeText(value);
      setIsGeneratedKeyCopied(true);
      toast.success(t("factory.profileDialog.actions.apiKeyCopied"));
    } catch {
      // Clipboard access is best-effort in local/mock profile settings.
    }
  }

  function handleDeleteApiKey(id: string) {
    setApiKeys((keys) => keys.filter((apiKey) => apiKey.id !== id));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="factory-profile-dialog" showCloseButton>
        <DialogTitle className="sr-only">
          {t("factory.profileDialog.title")}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("factory.profileDialog.description")}
        </DialogDescription>

        <aside className="factory-profile-sidebar">
          <button
            type="button"
            className="factory-profile-avatar-button"
            onClick={() => setActivePanel("avatar")}
            aria-label={t("factory.profileDialog.avatar.save")}
          >
            <Avatar className="factory-profile-avatar">
              <AvatarImage src={user.avatar} alt="" />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="factory-profile-avatar-edit" aria-hidden="true">
              <Pencil />
            </span>
          </button>

          <div className="factory-profile-identity">
            <p>{user.name}</p>
            <span>{user.accountType}</span>
          </div>

          <nav
            className="factory-profile-tabs"
            aria-label={t("factory.profileDialog.tabs.label")}
          >
            {profileTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className="factory-profile-tab u-press"
                  data-active={activeTab === tab.id}
                  onClick={() => setActivePanel(tab.id)}
                >
                  <Icon aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="factory-profile-content">
          {activePanel === "avatar" && (
            <ProfileSection
              title={t("factory.profileDialog.avatar.title")}
              subtitle={t("factory.profileDialog.avatar.subtitle")}
            >
              <FactoryAvatarPicker
                value={avatarDraft}
                onChange={setAvatarDraft}
                ariaLabel={t("factory.profileDialog.avatar.selectLabel")}
                ariaLabelPrefix={t("factory.profileDialog.avatar.optionPrefix")}
              />
              <div className="factory-profile-actions">
                <Button type="button" onClick={handleAvatarSave}>
                  <Save aria-hidden="true" />
                  {t("factory.profileDialog.avatar.save")}
                </Button>
              </div>
            </ProfileSection>
          )}

          {activePanel === "account" && (
            <ProfileSection
              title={t("factory.profileDialog.account.title")}
              subtitle={t("factory.profileDialog.account.subtitle")}
            >
              <div className="factory-profile-grid">
                <Field
                  label={t("factory.profileDialog.account.firstName")}
                  id="profile-first-name"
                >
                  <Input
                    id="profile-first-name"
                    value={accountDraft.firstName}
                    onChange={(event) =>
                      updateAccountDraft("firstName", event.target.value)
                    }
                  />
                </Field>
                <Field
                  label={t("factory.profileDialog.account.lastName")}
                  id="profile-last-name"
                >
                  <Input
                    id="profile-last-name"
                    value={accountDraft.lastName}
                    onChange={(event) =>
                      updateAccountDraft("lastName", event.target.value)
                    }
                  />
                </Field>
              </div>

              <Field
                label={t("factory.profileDialog.account.email")}
                id="profile-email"
              >
                <Input
                  id="profile-email"
                  type="email"
                  value={accountDraft.email}
                  onChange={(event) =>
                    updateAccountDraft("email", event.target.value)
                  }
                />
              </Field>

              <div className="factory-profile-grid">
                <SelectField
                  label={t("factory.profileDialog.account.location")}
                  value={accountDraft.location}
                  onValueChange={(value) =>
                    updateAccountDraft("location", value)
                  }
                  options={factoryLocations.map((location) => ({
                    value: location.id,
                    label: location.name,
                  }))}
                />
                <SelectField
                  label={t("factory.profileDialog.account.language")}
                  value={accountDraft.language}
                  onValueChange={(value) =>
                    updateAccountDraft("language", value as FactoryLanguage)
                  }
                  options={factoryLanguageOptions.map((language) => ({
                    value: language,
                    label: language,
                  }))}
                />
                <SelectField
                  label={t("factory.profileDialog.account.timezone")}
                  value={accountDraft.timezone}
                  onValueChange={(value) =>
                    updateAccountDraft("timezone", value as FactoryTimezone)
                  }
                  options={factoryTimezoneOptions.map((timezone) => ({
                    value: timezone,
                    label: timezone,
                  }))}
                />
                <SelectField
                  label={t("factory.profileDialog.account.appearance")}
                  value={accountDraft.appearance}
                  onValueChange={(value) =>
                    updateAccountDraft("appearance", value as FactoryAppearance)
                  }
                  options={factoryAppearanceOptions.map((appearance) => ({
                    value: appearance,
                    label: appearance,
                  }))}
                />
              </div>

              <SwitchRow
                id="profile-keyboard-shortcuts"
                title={t("factory.profileDialog.account.keyboardShortcuts")}
                description={t(
                  "factory.profileDialog.account.keyboardShortcutsDesc",
                )}
                checked={accountDraft.keyboardShortcuts}
                onCheckedChange={(checked) =>
                  updateAccountDraft("keyboardShortcuts", checked)
                }
              />

              <div className="factory-profile-actions">
                <Button type="button" onClick={handleAccountSave}>
                  <Save aria-hidden="true" />
                  {t("factory.profileDialog.account.update")}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 aria-hidden="true" />
                  {t("factory.profileDialog.account.delete")}
                </Button>
              </div>
            </ProfileSection>
          )}

          {activePanel === "security" && (
            <ProfileSection
              title={t("factory.profileDialog.security.title")}
              subtitle={t("factory.profileDialog.security.subtitle")}
            >
              <div className="factory-profile-setting-row">
                <SettingCopy
                  icon={RectangleEllipsis}
                  title={t("factory.profileDialog.security.twoFactorAuth")}
                  description={t(
                    "factory.profileDialog.security.twoFactorAuthDesc",
                  )}
                />
                <Button type="button" variant="outline">
                  <RectangleEllipsis aria-hidden="true" />
                  {t("factory.profileDialog.security.configure")}
                </Button>
              </div>
              <div className="factory-profile-setting-row">
                <SettingCopy
                  icon={KeyRound}
                  title={t("factory.profileDialog.security.backupCodes")}
                  description={t(
                    "factory.profileDialog.security.backupCodesDesc",
                  )}
                />
                <Button type="button" variant="outline">
                  <KeyRound aria-hidden="true" />
                  {t("factory.profileDialog.security.generate")}
                </Button>
              </div>

              <div className="factory-profile-subsection">
                <div className="factory-profile-subsection-header">
                  <h3>{t("factory.profileDialog.security.password")}</h3>
                  <Button
                    type="button"
                    variant={isPasswordFormOpen ? "default" : "outline"}
                    onClick={handlePasswordAction}
                  >
                    <Lock aria-hidden="true" />
                    {t("factory.profileDialog.security.updatePassword")}
                  </Button>
                </div>
                {isPasswordFormOpen && (
                  <>
                    <Field
                      label={t(
                        "factory.profileDialog.security.currentPassword",
                      )}
                      id="profile-current-password"
                    >
                      <Input id="profile-current-password" type="password" />
                    </Field>
                    <Field
                      label={t("factory.profileDialog.security.newPassword")}
                      id="profile-new-password"
                    >
                      <Input id="profile-new-password" type="password" />
                    </Field>
                    <Field
                      label={t("factory.profileDialog.security.repeatPassword")}
                      id="profile-repeat-password"
                    >
                      <Input id="profile-repeat-password" type="password" />
                    </Field>
                  </>
                )}
              </div>

              <div className="factory-profile-subsection">
                <h3>{t("factory.profileDialog.security.signInMethods")}</h3>
                <SignInMethod
                  icon={Mail}
                  title={t("factory.profileDialog.security.google")}
                  description={t("factory.profileDialog.security.googleDesc")}
                  actionLabel={t("factory.profileDialog.security.connect")}
                />
                <SignInMethod
                  icon={Apple}
                  title={t("factory.profileDialog.security.apple")}
                  description={t("factory.profileDialog.security.appleDesc")}
                  actionLabel={t("factory.profileDialog.security.connect")}
                />
              </div>
            </ProfileSection>
          )}

          {activePanel === "notifications" && (
            <ProfileSection
              title={t("factory.profileDialog.notifications.title")}
              subtitle={t("factory.profileDialog.notifications.subtitle")}
            >
              {notificationOptions.map((option) => (
                <SwitchRow
                  key={option.id}
                  id={`profile-notification-${option.id}`}
                  title={option.title}
                  description={option.description}
                  checked={notifications[option.id] ?? false}
                  onCheckedChange={(checked) =>
                    setNotifications((current) => ({
                      ...current,
                      [option.id]: checked,
                    }))
                  }
                />
              ))}
            </ProfileSection>
          )}

          {activePanel === "apiKeys" && (
            <ProfileSection
              title={t("factory.profileDialog.apiKeys.title")}
              subtitle={t("factory.profileDialog.apiKeys.subtitle")}
            >
              <div className="factory-profile-api-header">
                <div>
                  <h3>{t("factory.profileDialog.apiKeys.activeKeys")}</h3>
                  <p>{t("factory.profileDialog.apiKeys.activeKeysDesc")}</p>
                </div>
                <Popover
                  open={isApiKeyPopoverOpen}
                  onOpenChange={handleApiKeyPopoverOpenChange}
                >
                  <PopoverTrigger asChild>
                    <Button type="button">
                      <KeyRound aria-hidden="true" />
                      {t("factory.profileDialog.apiKeys.generateKey")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end">
                    <PopoverHeader>
                      <PopoverTitle>
                        {t("factory.profileDialog.apiKeys.newKeyTitle")}
                      </PopoverTitle>
                      <PopoverDescription>
                        {t("factory.profileDialog.apiKeys.newKeyDesc")}
                      </PopoverDescription>
                    </PopoverHeader>
                    {!generatedKey && (
                      <>
                        <Field
                          label={t("factory.profileDialog.apiKeys.keyName")}
                          id="profile-api-key-name"
                        >
                          <Input
                            id="profile-api-key-name"
                            value={apiKeyName}
                            onChange={(event) =>
                              setApiKeyName(event.target.value)
                            }
                          />
                        </Field>
                        <Button type="button" onClick={handleGenerateApiKey}>
                          <Plus aria-hidden="true" />
                          {t("factory.profileDialog.apiKeys.generate")}
                        </Button>
                      </>
                    )}
                    {generatedKey && (
                      <div className="factory-profile-generated-key">
                        <Label htmlFor="profile-generated-key">
                          {t("factory.profileDialog.apiKeys.copyKey")}
                        </Label>
                        <div>
                          <Input
                            id="profile-generated-key"
                            value={generatedKey}
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className={
                              isGeneratedKeyCopied
                                ? "factory-profile-copy-success"
                                : undefined
                            }
                            aria-label={t(
                              "factory.profileDialog.apiKeys.copyKey",
                            )}
                            onClick={() => handleCopyGeneratedKey(generatedKey)}
                          >
                            {isGeneratedKeyCopied ? <Check /> : <Copy />}
                          </Button>
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="factory-profile-key-list">
                {apiKeys.map((apiKey) => (
                  <div className="factory-profile-key-row" key={apiKey.id}>
                    <div>
                      <p>{apiKey.name}</p>
                      <span>{apiKey.maskedKey}</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      aria-label={t("factory.profileDialog.apiKeys.deleteKey", {
                        name: apiKey.name,
                      })}
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}

function ProfileSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="factory-profile-section">
      <div className="factory-profile-section-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="factory-profile-field">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
}) {
  const id = `profile-select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="factory-profile-field">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="factory-profile-select-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SwitchRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="factory-profile-switch-row">
      <div>
        <Label htmlFor={id}>{title}</Label>
        <p>{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function SettingCopy({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="factory-profile-setting-copy">
      <span aria-hidden="true">
        <Icon />
      </span>
      <div>
        <p>{title}</p>
        <small>{description}</small>
      </div>
    </div>
  );
}

function SignInMethod({
  icon: Icon,
  title,
  description,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="factory-profile-setting-row">
      <SettingCopy icon={Icon} title={title} description={description} />
      <Button type="button" variant="outline">
        <Plug aria-hidden="true" />
        {actionLabel}
      </Button>
    </div>
  );
}
