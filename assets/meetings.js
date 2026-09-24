// Senn PAC meeting schedule, 2026-27. Source: AP Melody Littlefair's calendar invites (9/23/26).
// To update: edit MEETINGS below. The homepage picks the next upcoming date on its own.
// Set `location` or `agenda` on a meeting once it's known; otherwise the card says TBD.
(function () {
    var MEETINGS = [
        { date: '2026-09-22' },
        { date: '2026-10-13' },
        { date: '2026-11-10' },
        { date: '2026-12-08' },
        { date: '2027-01-12' },
        { date: '2027-02-09' },
        { date: '2027-03-09' },
        { date: '2027-04-20' },
        { date: '2027-05-11' },
        { date: '2027-06-08' }
    ];
    var START = '19:00', END = '20:00'; // Central Time

    var T = {
        en: {
            label: 'Up Next', heading: 'Next PAC Meeting', time: '7:00&ndash;8:00 PM CT',
            tbd: 'Location TBD', tbdNote: 'Location and join link are shared the week before, on the <a href="https://www.sennhs.org/apps/events/" target="_blank" rel="noopener">Senn events page</a>.',
            addOne: 'Add to Calendar', addAll: 'Add All Meetings to My Calendar', minutes: 'Past Minutes', join: 'Become a Member',
            yearHeading: '2026&ndash;27 Meeting Dates', yearNote: 'All meetings are Tuesdays, 7:00&ndash;8:00 PM CT.',
            next: 'Next', done: 'Done', welcome: 'All parents and guardians are welcome. You do not need to be a member to attend.',
            over: 'That wraps the 2026&ndash;27 school year. Next year\'s dates are coming soon.',
            locale: 'en-US', calTitle: 'Senn PAC Meeting', calDetails: 'Parent Advisory Council Meeting, Nicholas Senn High School. Location and join link: sennhs.org/apps/events or sennparents.com'
        },
        es: {
            label: 'Próximamente', heading: 'Próxima Reunión del CAP', time: '7:00&ndash;8:00 PM (hora central)',
            tbd: 'Lugar por confirmar', tbdNote: 'El lugar y el enlace para unirse se comparten la semana anterior, en la <a href="https://www.sennhs.org/apps/events/" target="_blank" rel="noopener">página de eventos de Senn</a>.',
            addOne: 'Agregar al Calendario', addAll: 'Agregar Todas las Reuniones a Mi Calendario', minutes: 'Actas Anteriores', join: 'Conviértase en Miembro',
            yearHeading: 'Fechas de Reuniones 2026&ndash;27', yearNote: 'Todas las reuniones son los martes, de 7:00 a 8:00 PM (hora central).',
            next: 'Próxima', done: 'Hecha', welcome: 'Todos los padres y tutores son bienvenidos. No necesita ser miembro para asistir.',
            over: 'Así termina el año escolar 2026&ndash;27. Pronto publicaremos las fechas del próximo año.',
            locale: 'es-US', calTitle: 'Reunión del CAP de Senn', calDetails: 'Reunión del Consejo Asesor de Padres, Nicholas Senn High School. Lugar y enlace: sennhs.org/apps/events o sennparents.com'
        }
    };

    function parse(m) { var p = m.date.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function fmt(d, t, opts) { var s = d.toLocaleDateString(t.locale, opts); return s.charAt(0).toUpperCase() + s.slice(1); }
    // Chicago is UTC-5 in daylight time (2nd Sunday of March to 1st Sunday of November), UTC-6 otherwise
    function nthSunday(y, month, n) { var first = new Date(y, month, 1).getDay(); return 1 + (7 - first) % 7 + (n - 1) * 7; }
    function utcStamp(m, hhmm) {
        var d = parse(m), y = d.getFullYear(), mo = d.getMonth(), day = d.getDate();
        var cdt = (mo > 2 && mo < 10) || (mo === 2 && day >= nthSunday(y, 2, 2)) || (mo === 10 && day < nthSunday(y, 10, 1));
        var h = +hhmm.split(':')[0] + (cdt ? 5 : 6), mi = hhmm.split(':')[1];
        var u = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), h, +mi));
        return u.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }
    function gcal(m, t) {
        return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
            + '&text=' + encodeURIComponent(t.calTitle)
            + '&dates=' + utcStamp(m, START) + '/' + utcStamp(m, END)
            + '&details=' + encodeURIComponent(t.calDetails)
            + '&location=' + encodeURIComponent(m.location || 'Nicholas Senn High School, 5900 N Glenwood Ave, Chicago, IL 60660');
    }

    function render(el) {
        var lang = el.getAttribute('data-lang') === 'es' ? 'es' : 'en', t = T[lang];
        var today = new Date(); today.setHours(0, 0, 0, 0);
        var next = null;
        MEETINGS.forEach(function (m) { if (!next && parse(m) >= today) next = m; });

        var outline = ' style="border-color: var(--green-mid); color: var(--green-mid);"';
        var joinHref = lang === 'es' ? 'unase.html' : 'join.html';
        var h = '<p class="section-label">' + t.label + '</p><h2>' + t.heading + '</h2><div class="meeting-card">';

        if (next) {
            var d = parse(next);
            h += '<div class="meeting-detail"><span class="icon">&#128197;</span><div><strong>' + fmt(d, t, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + '</strong></div></div>'
               + '<div class="meeting-detail"><span class="icon">&#128336;</span><div><strong>' + t.time + '</strong></div></div>'
               + '<div class="meeting-detail"><span class="icon">&#128205;</span><div>' + (next.location ? '<strong>' + next.location + '</strong>' : '<strong>' + t.tbd + '</strong><br><span style="font-size: 0.9rem; color: var(--gray-600);">' + t.tbdNote + '</span>') + '</div></div>';
            if (next.agenda) {
                h += '<div class="agenda-list"><h3>Agenda</h3><ul>' + next.agenda.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul></div>';
            }
            h += '<div class="meeting-buttons"><a href="' + joinHref + '" class="btn btn-gold">' + t.join + '</a>'
               + '<a href="' + gcal(next, t) + '" class="btn btn-outline" target="_blank" rel="noopener"' + outline + '>' + t.addOne + '</a>'
               + '<a href="minutes.html" class="btn btn-outline"' + outline + '>' + t.minutes + '</a></div>';
        } else {
            h += '<p style="color: var(--gray-700);">' + t.over + '</p>';
        }

        h += '<div class="year-list"><h3>' + t.yearHeading + '</h3><p class="year-note">' + t.yearNote + '</p><ul>';
        MEETINGS.forEach(function (m) {
            var d = parse(m), past = d < today, isNext = m === next;
            h += '<li class="' + (past ? 'past' : '') + (isNext ? ' next' : '') + '">'
               + '<span class="yl-date">' + fmt(d, t, { weekday: 'short', month: 'short', day: 'numeric' }) + '</span>'
               + (isNext ? '<span class="yl-tag">' + t.next + '</span>' : past ? '<span class="yl-tag done">' + t.done + '</span>' : '<a class="yl-add" href="' + gcal(m, t) + '" target="_blank" rel="noopener" aria-label="' + t.addOne + '">+ ' + t.addOne + '</a>')
               + '</li>';
        });
        h += '</ul><a href="senn-pac-2026-27.ics" class="btn btn-gold year-all">&#128197; ' + t.addAll + '</a></div>';
        h += '<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--gray-600);">' + t.welcome + '</p></div>';
        el.innerHTML = h;
    }

    var css = document.createElement('style');
    css.textContent = '.year-list{margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid var(--gray-100)}'
        + '.year-list h3{font-size:1.1rem;color:var(--green);margin-bottom:.15rem}'
        + '.year-note{font-size:.85rem;color:var(--gray-600);margin-bottom:.75rem}'
        + '.year-list ul{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:.4rem .75rem}'
        + '.year-list li{display:flex;justify-content:space-between;align-items:center;gap:.5rem;padding:.55rem .75rem;border-radius:8px;background:var(--off-white);font-size:.92rem}'
        + '.year-list li.next{background:var(--green);color:#fff}'
        + '.year-list li.past{opacity:.5}'
        + '.yl-date{font-weight:600}'
        + '.yl-tag{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;background:var(--gold);color:var(--green);padding:.1rem .5rem;border-radius:999px}'
        + '.yl-tag.done{background:transparent;color:var(--gray-600)}'
        + '.yl-add{font-size:.75rem;color:var(--green-mid);text-decoration:none;font-weight:600;white-space:nowrap}'
        + '.year-all{margin-top:1rem;display:inline-block}'
        + '@media (max-width:600px){.year-list ul{grid-template-columns:1fr}.year-all{width:100%;text-align:center}}';
    document.head.appendChild(css);

    document.querySelectorAll('[data-pac-meetings]').forEach(render);
})();
