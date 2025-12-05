# Session Start Routine

Befolge diese Schritte am Anfang jeder Coding-Session:

## 1. Umgebung verifizieren

```powershell
# Verzeichnis prüfen
pwd

# Init-Skript ausführen
.\init.ps1
```

## 2. Git-Status und Historie prüfen

```powershell
git status
git log --oneline -10
git diff HEAD~1 --stat
```

## 3. Fortschrittsdatei lesen

Öffne und lies `claude-progress.txt` um zu verstehen:
- Was wurde in der letzten Session gemacht
- Welche Probleme gibt es
- Was sind die nächsten Prioritäten

## 4. Feature-Liste analysieren

Öffne `features.json` und:
1. Finde das nächste Feature mit `"passes": false` und höchster Priorität (niedrigste Zahl)
2. Wähle EIN Feature für diese Session
3. Notiere die Feature-ID

## 5. Development Server starten (optional)

```powershell
npx expo start
```

## 6. Grundfunktionalität verifizieren

Bevor du neue Features implementierst:
- Prüfe ob die App startet
- Prüfe ob bestehende Features noch funktionieren
- Führe `npx tsc --noEmit` aus um TypeScript-Fehler zu finden

---

## Session-Ende Checkliste

- [ ] Feature vollständig implementiert und getestet
- [ ] `features.json` aktualisiert (passes: true nur wenn wirklich fertig!)
- [ ] Git commit mit aussagekräftiger Message
- [ ] `claude-progress.txt` aktualisiert
- [ ] TypeScript-Check ohne Fehler

## Bekannte Fehlermuster vermeiden

| Problem | Lösung |
|---------|--------|
| Zu viele Features auf einmal | Ein Feature pro Session |
| Feature voreilig als fertig markiert | Erst nach vollständigem Test markieren |
| Undokumentierte Änderungen | Immer committen + Progress updaten |
| Setup unklar | init.ps1 lesen und ausführen |

## Wichtige Befehle

```powershell
# TypeScript prüfen
npx tsc --noEmit

# Dev Server starten
npx expo start

# Tests ausführen (wenn konfiguriert)
npm test

# Alle Änderungen committen
git add -A && git commit -m "feat: [beschreibung]"
```
