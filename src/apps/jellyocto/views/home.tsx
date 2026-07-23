import JellyoctoIcon from "@/apps/jellyocto/assets/logo-icon.svg";
import JellyoctoLogo from "@/apps/jellyocto/assets/logo.svg";

export function JellyoctoHome() {
  return (
    <main className="jellyocto-page">
      <h1>Jellyocto</h1>
      <img src={JellyoctoLogo} alt="Jellyocto logo" />
      <img src={JellyoctoIcon} />
    </main>
  );
}
