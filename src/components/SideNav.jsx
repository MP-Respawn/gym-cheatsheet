/*
 * SideNav.jsx
 *
 * The navigation column shown on wide screens (900px and up) instead of the
 * bottom tab bar and the hamburger menu. Always rendered; styles.css hides
 * it on phones. Same content as MenuDrawer: the wordmark, the main links,
 * the Modo gym switch and the backup tools.
 */
import { useState } from "react";
import { useIsPersistent } from "../store/useStore.js";
import { Brand } from "./AppHeader.jsx";
import { LINKS } from "./navLinks.js";
import { BackupControls, GymSwitch, Icon, StorageNote } from "./navShared.jsx";

export default function SideNav({ activeTab, gymMode, onGymModeChange }) {
  const persistent = useIsPersistent();
  const [backupMessage, setBackupMessage] = useState("");

  return (
    <nav className="sidenav" aria-label="Menú principal">
      <a className="sidenav-brand" href="#/" aria-label="Respawn Fitness, inicio">
        <Brand />
      </a>

      {LINKS.map((link) => {
        const current = link.tab !== null && link.tab === activeTab;
        return (
          <a
            key={link.href}
            href={link.href}
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

      <h2 className="sidenav-section">Tus datos</h2>
      <BackupControls
        linkClass="sidenav-link"
        noteClass="sidenav-note"
        message={backupMessage}
        onMessage={setBackupMessage}
      />

      <div className="sidenav-foot">
        <StorageNote persistent={persistent} />
      </div>
    </nav>
  );
}
