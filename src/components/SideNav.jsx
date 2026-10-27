/*
 * SideNav.jsx
 *
 * The navigation column shown on wide screens (900px and up) instead of the
 * bottom tab bar and the hamburger menu. Always rendered; styles.css hides
 * it on phones. Same content as MenuDrawer: the wordmark, the main links,
 * the Modo gym switch and your account.
 */
import { useIsTrainer } from "../store/useStore.js";
import { Brand } from "./AppHeader.jsx";
import { linksFor } from "./navLinks.js";
import { AccountControls, GymSwitch, Icon, SyncNote } from "./navShared.jsx";

export default function SideNav({ activeTab, exercisesHref = "#/", gymMode, onGymModeChange }) {
  const isTrainer = useIsTrainer();
  return (
    <nav className="sidenav" aria-label="Menú principal">
      <a className="sidenav-brand" href="#/" aria-label="Respawn Fitness, inicio">
        <Brand />
      </a>

      {linksFor(isTrainer).map((link) => {
        const current = link.tab !== null && link.tab === activeTab;
        return (
          <a
            key={link.href}
            href={link.tab === "exercises" ? exercisesHref : link.href}
            className={current ? "sidenav-link active" : "sidenav-link"}
            aria-current={current ? "page" : undefined}
          >
            <Icon d={link.icon} />
            {link.label}
          </a>
        );
      })}

      <h2 className="sidenav-section">Entrenamiento</h2>
      <GymSwitch on={gymMode} onChange={onGymModeChange} className="sidenav-link sidenav-switch" />

      <h2 className="sidenav-section">Tu cuenta</h2>
      <AccountControls linkClass="sidenav-link" noteClass="sidenav-note" />

      <div className="sidenav-foot">
        <SyncNote />
      </div>
    </nav>
  );
}
