export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto p-8 space-y-12">
      {/* Titel */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Over de AvansKompas Applicatie</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          De <strong>AvansKompas</strong> applicatie is ontwikkeld als digitaal hulpmiddel voor studenten 
          van Avans Hogeschool om eenvoudiger keuzeonderwijs te vinden, vergelijken en beheren.  
          Studenten kunnen modules zoeken, filteren, favorieten opslaan en zelfs gepersonaliseerde aanbevelingen ontvangen.
        </p>
      </section>

      {/* Gebruikte packages */}
      <section className="mt-4">
        <h2 className="text-2xl font-semibold mb-3">Gebruikte Packages & Technologieën</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>Frontend:</strong> Next.js (App Router) met TypeScript, TailwindCSS</li>
          <li><strong>Backend:</strong> NestJS met Mongoose (MongoDB)</li>
          <li><strong>Authenticatie:</strong> JWT (JSON Web Tokens)</li>
          <li><strong>Data fetching:</strong> Axios & React Query</li>
          <li><strong>Styling:</strong> Bootstrap & Bootstrap icons</li>
          <li><strong>Dev tooling:</strong> Nx Monorepo setup, Concurrently</li>
          <li><strong>Testing:</strong> Jest & Supertest (API tests)</li>
        </ul>
      </section>

      {/* Epics tabel */}
    <section className="mt-4">
        <h2 className="mb-3">Epics</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: "5%" }}>ID</th>
                <th scope="col" style={{ width: "25%" }}>Epic</th>
                <th scope="col">Beschrijving</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>E1</td>
                <td>Modules bekijken & zoeken</td>
                <td>Overzicht, zoekfunctie en filters voor modules.</td>
              </tr>
              <tr>
                <td>E2</td>
                <td>Module detailpagina</td>
                <td>Details van modules tonen inclusief docent en literatuur.</td>
              </tr>
              <tr>
                <td>E3</td>
                <td>Favorieten</td>
                <td>Modules opslaan en beheren als favorieten.</td>
              </tr>
              <tr>
                <td>E4</td>
                <td>Persoonlijk advies</td>
                <td>Aanbevelingen op basis van interesses en favorieten.</td>
              </tr>
              <tr>
                <td>E5</td>
                <td>Toegankelijkheid & gebruiksgemak</td>
                <td>Dark mode, taalinstellingen en PWA-functionaliteit.</td>
              </tr>
              <tr>
                <td>E6</td>
                <td>Authenticatie & persoonlijke omgeving</td>
                <td>Inloggen, JWT-authenticatie en persistente voorkeuren.</td>
              </tr>
              <tr>
                <td>E7</td>
                <td>Interactie & delen</td>
                <td>Favorieten exporteren en delen via link.</td>
              </tr>
              <tr>
                <td>E8</td>
                <td>Admin functionaliteit</td>
                <td>Beheren van modules en inzicht in populariteit.</td>
              </tr>
              <tr>
                <td>E9</td>
                <td>Profiel functionaliteit</td>
                <td>Beheren van gebruikersprofielen en instellingen.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* User stories tabel */}
    <section className="mt-4">
        <h2 className=" mb-3">User Stories</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Titel</th>
                <th scope="col">Beschrijving</th>
                <th scope="col">Acceptatiecriteria</th>
                <th scope="col">Prio</th>
              </tr>
            </thead>
            <tbody>
              {/* Epic 1 – Modules bekijken & zoeken */}
              <tr>
                <td>US1E1</td>
                <td>Modules overzicht</td>
                <td>Als student wil ik een overzicht van alle beschikbare modules kunnen zien, zodat ik een eerste indruk krijg van het aanbod.</td>
                <td>
                  <ul className="mb-0">
                    <li>Alle modules worden opgehaald uit de database.</li>
                    <li>Elke module wordt weergegeven in een overzichtskaart.</li>
                    <li>Bij lege resultaten verschijnt een melding “Geen modules gevonden”.</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              <tr>
                <td>US2E1</td>
                <td>Zoekfunctie</td>
                <td>Als student wil ik kunnen zoeken op naam of trefwoord, zodat ik snel de module kan vinden die ik in gedachten heb.</td>
                <td>
                  <ul className="mb-0">
                    <li>Een zoekbalk is zichtbaar op de overzichtspagina.</li>
                    <li>Zoekresultaten worden direct gefilterd tijdens het typen.</li>
                    <li>Zoekfunctie werkt case-insensitive.</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              <tr>
                <td>US3E1</td>
                <td>Filteren</td>
                <td>Als student wil ik modules kunnen filteren op studiepunten, niveau of thema, zodat ik modules kan vinden die bij mijn planning passen.</td>
                <td>
                  <ul className="mb-0">
                    <li>Filters zijn zichtbaar boven het overzicht.</li>
                    <li>Student kan meerdere filters tegelijk toepassen.</li>
                    <li>Actieve filters worden visueel weergegeven en kunnen worden verwijderd.</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              {/* Epic 2 – Module detailpagina */}
              <tr>
                <td>US1E2</td>
                <td>Detailpagina</td>
                <td>Als student wil ik de details van een module kunnen bekijken, zodat ik een goed geïnformeerde keuze kan maken.</td>
                <td>
                  <ul className="mb-0">
                    <li>Detailpagina toont titel, beschrijving, EC, niveau, periode en locatie.</li>
                    <li>Bij het openen van een module wordt data opgehaald via de API.</li>
                    <li>Foutmeldingen worden correct afgehandeld (bijv. “Module niet gevonden”).</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              {/* Epic 3 – Favorieten */}
              <tr>
                <td>US1E3</td>
                <td>Favorieten beheren</td>
                <td>Als student wil ik modules kunnen toevoegen aan een favorietenlijst, zodat ik eenvoudig mijn opties kan bijhouden.</td>
                <td>
                  <ul className="mb-0">
                    <li>Elke modulekaart heeft een favoriet-knop (harticoon).</li>
                    <li>Favorieten worden opgeslagen in de database per gebruiker.</li>
                    <li>Favorietenlijst is toegankelijk via een aparte pagina.</li>
                  </ul>
                </td>
                <td>S</td>
              </tr>

              {/* Epic 4 – Persoonlijk advies */}
              <tr>
                <td>US1E4</td>
                <td>Aanbevelingen</td>
                <td>Als student wil ik aanbevelingen krijgen op basis van mijn favorieten of interesses, zodat ik sneller passende modules vind.</td>
                <td>
                  <ul className="mb-0">
                    <li>Bij minstens één favoriet worden gerelateerde modules getoond.</li>
                    <li>Suggesties worden duidelijk onderscheiden van standaard modules.</li>
                  </ul>
                </td>
                <td>C</td>
              </tr>

              <tr>
                <td>US2E4</td>
                <td>Interesses opgeven</td>
                <td>Als student wil ik mijn interesses kunnen aangeven, zodat de app gepersonaliseerde aanbevelingen kan doen.</td>
                <td>
                  <ul className="mb-0">
                    <li>Interesses kunnen worden geselecteerd in de profielpagina.</li>
                    <li>Voorkeuren worden opgeslagen in de database en gebruikt bij aanbevelingen.</li>
                  </ul>
                </td>
                <td>W</td>
              </tr>

              {/* Epic 5 – Toegankelijkheid & gebruiksgemak */}
              <tr>
                <td>US1E5</td>
                <td>Dark mode</td>
                <td>Als student wil ik de applicatie in dark mode kunnen gebruiken, zodat ik de interface kan aanpassen aan mijn voorkeur.</td>
                <td>
                  <ul className="mb-0">
                    <li>Gebruiker kan schakelen tussen light en dark mode.</li>
                    <li>Voorkeur wordt onthouden (via localStorage).</li>
                  </ul>
                </td>
                <td>W</td>
              </tr>

              <tr>
                <td>US2E5</td>
                <td>Taalinstellingen</td>
                <td>Als student wil ik de taal van de interface kunnen wisselen tussen Nederlands en Engels, zodat de app toegankelijk is voor internationale studenten.</td>
                <td>
                  <ul className="mb-0">
                    <li>Taal kan worden gekozen via een dropdown of instelling.</li>
                    <li>De gekozen taal wordt toegepast op de volledige interface.</li>
                  </ul>
                </td>
                <td>C</td>
              </tr>

              <tr>
                <td>US3E5</td>
                <td>PWA</td>
                <td>Als student wil ik de applicatie kunnen installeren als PWA, zodat ik deze snel kan openen op mijn laptop of telefoon.</td>
                <td>
                  <ul className="mb-0">
                    <li>De applicatie voldoet aan PWA-criteria (manifest + service worker).</li>
                    <li>App kan offline geladen worden.</li>
                  </ul>
                </td>
                <td>W</td>
              </tr>

              {/* Epic 6 – Authenticatie */}
              <tr>
                <td>US1E6</td>
                <td>Login met JWT</td>
                <td>Als student wil ik veilig kunnen inloggen met mijn Avans-account, zodat mijn favorieten en voorkeuren persoonlijk worden opgeslagen.</td>
                <td>
                  <ul className="mb-0">
                    <li>Login werkt met JWT-authenticatie.</li>
                    <li>Ongeldige logins tonen foutmeldingen.</li>
                    <li>Na login wordt gebruiker doorgestuurd naar de homepage.</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              <tr>
                <td>US2E6</td>
                <td>Persistente data</td>
                <td>Als student wil ik dat mijn favorieten en voorkeuren worden opgeslagen in de database, zodat ik ze bij volgende sessies terugvind.</td>
                <td>
                  <ul className="mb-0">
                    <li>Favorieten en voorkeuren worden geladen bij inloggen.</li>
                    <li>Data blijft behouden na opnieuw opstarten van de applicatie.</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              {/* Epic 7 – Interactie & delen */}
              <tr>
                <td>US1E7</td>
                <td>Favorieten exporteren</td>
                <td>Als student wil ik mijn favorieten kunnen exporteren als PDF, zodat ik deze kan delen met mijn studieadviseur.</td>
                <td>
                  <ul className="mb-0">
                    <li>Een knop “Exporteren als PDF” is zichtbaar op de favorietenpagina.</li>
                    <li>Gegenereerd PDF bevat module-informatie en datum van export.</li>
                  </ul>
                </td>
                <td>C</td>
              </tr>

              <tr>
                <td>US2E7</td>
                <td>Delen via link</td>
                <td>Als student wil ik modules kunnen delen via een unieke link, zodat ik aanbevelingen kan sturen naar klasgenoten.</td>
                <td>
                  <ul className="mb-0">
                    <li>Elke module heeft een deelbare URL.</li>
                    <li>De link opent direct de juiste detailpagina.</li>
                  </ul>
                </td>
                <td>C</td>
              </tr>

              {/* Epic 8 – Admin functionaliteit */}
              <tr>
                <td>US1E8</td>
                <td>Admin CRUD</td>
                <td>Als beheerder wil ik modules kunnen toevoegen, bewerken en verwijderen, zodat de informatie actueel blijft.</td>
                <td>
                  <ul className="mb-0">
                    <li>Admins hebben toegang tot een beheerinterface.</li>
                    <li>CRUD-acties werken en updaten de database correct.</li>
                  </ul>
                </td>
                <td>S</td>
              </tr>

              <tr>
                <td>US2E8</td>
                <td>Statistieken</td>
                <td>Als beheerder wil ik inzicht krijgen in populaire modules, zodat ik trends kan analyseren en aanbod kan verbeteren.</td>
                <td>
                  <ul className="mb-0">
                    <li>Dashboard toont modules op basis van aantal favorieten.</li>
                    <li>Data wordt dynamisch uit de database opgehaald.</li>
                  </ul>
                </td>
                <td>W</td>
              </tr>

              {/* Epic 9 – Profiel functionaliteit */}
              <tr>
                <td>US1E9</td>
                <td>Profiel bekijken</td>
                <td>
                  Als student wil ik mijn profielgegevens kunnen bekijken,
                  zodat ik weet welke informatie is gekoppeld aan mijn account.
                </td>
                <td>
                  <ul className="mb-0">
                    <li>Gebruiker kan naar een profielpagina navigeren via het menu of icoon.</li>
                    <li>De profielpagina toont voornaam, achternaam, e-mailadres, studentnummer en interesses.</li>
                    <li>De gegevens worden geladen uit de database van de ingelogde gebruiker.</li>
                    <li>Onbevoegde gebruikers kunnen de profielpagina niet bekijken.</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              <tr>
                <td>US2E9</td>
                <td>Profiel updaten</td>
                <td>
                  Als student wil ik mijn profiel kunnen aanpassen (zoals naam, interesses en contactgegevens),
                  zodat mijn gegevens altijd up-to-date zijn.
                </td>
                <td>
                  <ul className="mb-0">
                    <li>Een knop “Bewerken” maakt velden bewerkbaar op de profielpagina.</li>
                    <li>Wijzigingen worden gevalideerd voordat ze worden opgeslagen (bijv. correcte e-mailformaat).</li>
                    <li>Na opslaan verschijnt een bevestiging (“Profiel succesvol bijgewerkt”).</li>
                    <li>Data wordt geüpdatet in de database via een beveiligde API-call.</li>
                  </ul>
                </td>
                <td>M</td>
              </tr>

              <tr>
                <td>US3E9</td>
                <td>Profielfoto wijzigen</td>
                <td>
                  Als student wil ik een profielfoto kunnen uploaden of wijzigen,
                  zodat mijn profiel persoonlijker wordt en anderen mij kunnen herkennen.
                </td>
                <td>
                  <ul className="mb-0">
                    <li>Een uploadknop is zichtbaar bij de huidige profielfoto.</li>
                    <li>Gebruiker kan een afbeelding uploaden in JPEG of PNG-formaat (max 5MB).</li>
                    <li>Na upload wordt de foto direct geüpdatet en opgeslagen in de database of cloud storage.</li>
                    <li>Er wordt een fallback-afbeelding getoond als er geen foto aanwezig is.</li>
                  </ul>
                </td>
                <td>W</td>
              </tr>

              <tr>
                <td>US4E9</td>
                <td>Interesses beheren</td>
                <td>
                  Als student wil ik mijn interesses kunnen toevoegen of verwijderen in mijn profiel,
                  zodat ik relevante module-aanbevelingen krijg.
                </td>
                <td>
                  <ul className="mb-0">
                    <li>Gebruiker kan interesses selecteren uit een vooraf gedefinieerde lijst van thema’s.</li>
                    <li>Geselecteerde interesses worden opgeslagen in de database.</li>
                    <li>Bij het openen van de profielpagina worden bestaande interesses geladen.</li>
                    <li>Verwijderen of toevoegen van interesses wordt direct zichtbaar in de UI.</li>
                    <li>Wijzigingen in interesses beïnvloeden module-aanbevelingen op de homepage.</li>
                  </ul>
                </td>
                <td>W</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
