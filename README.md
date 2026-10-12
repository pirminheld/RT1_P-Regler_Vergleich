# RT1 – P-Regler im Vergleich

`index.html` per Doppelklick öffnen. Alle Dateien gemeinsam aufbewahren. Keine Installation, externen Schriftarten, Bibliotheken oder Internetverbindung erforderlich.

## Unterricht

1. Elektronischer P-Regler: Sollwert, Istwert und R₂ verändern; Kennlinie, Vorzeichen und Ausgangsbegrenzung untersuchen. Zwei Schaltflächen stellen Aufgabe 3 b/c her.
2. Mechanischer Schwimmerregler: Simulation starten, Abfluss verändern, Gleichgewicht beobachten. „Abfluss 2 → 4 L/s“ beginnt im alten Gleichgewicht. K beeinflusst Hebel-/Ventilwirkung. Die Beameransicht vergrößert Bedienelemente und blendet die Einleitung aus.
3. Vergleich: Größen, Gegenwirkung, Verstärkung und Grenzen gemeinsam zuordnen.

## Fachlicher Bezug und Modell

Anschluss an Raffa, „5. Regler“, gedruckte S. 27–30 und Aufgabe 3 auf S. 33. Grafiken eigenständig erstellt; keine Skriptabbildungen eingebettet. Elektronik: Differenzbildung Ux−Uw als Funktionsblock und anschließender invertierender Verstärker. R₁=10 kΩ, KPR=R₂/R₁, Uy=KPR(Uw−Ux), Ausgang auf ±12 V begrenzt. Das Elektronikmodell zeigt nur den Regler, keinen geschlossenen Kreis.

Mechanik: vereinfachter Schwimmerregler ohne Voröffnung. qzu=clamp(K(w−h),0,8) in L/s; A=1 L/cm; dh/dt=(qzu−qab)/A. Ventilöffnung y=100%·qzu/8. K in L/(s·cm) enthält Regler- und Ventilwirkung und ist nicht direkt mit dem dimensionslosen elektronischen KPR gleichzusetzen. Im Gleichgewicht mit positivem Abfluss: h=w−qab/K. Bei maximalem Abfluss und voll offenem Ventil ist das Gleichgewicht nicht eindeutig. Ein Sollwert unter dem Istwert kann bei Abfluss null nicht aktiv erreicht werden. Hebel geometrisch schematisch. Keine Druckabhängigkeit, Reibung oder Verzögerung im Stellglied; keine Schwingungen in diesem Modell. Physikalische Grenzen 0≤h≤100 cm. Numerische Integration in 20-ms-Schritten. Beim Verlassen der mechanischen Ansicht pausiert die Simulation.

FTS_logo.png und impressum.html unverändert übernommen aus dem vorhandenen Projekt RT1_OPV-Grundschaltungen-3.1-bis-3.8. Rechtstext nicht neu bewertet. Offline keine Netzwerkanfragen. Veröffentlichung als statische GitHub-Pages-Seite.
