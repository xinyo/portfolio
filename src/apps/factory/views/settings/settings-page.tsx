import { useTranslation } from "react-i18next";

type SettingsPageProps = {
  titleKey: string;
};

export function SettingsPage({ titleKey }: SettingsPageProps) {
  const { t } = useTranslation();

  return (
    <section className="factory-view factory-settings-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t(titleKey)}</h2>
        </div>
      </div>
    </section>
  );
}
