(() => {
  const personControl = document.querySelector('#person-selector, #personSelect, [data-person-selector]');
  const dayControl = document.querySelector('#day-selector, #daySelect, [data-day-selector]');
  const themeControl = document.querySelector('#theme-selector, [data-theme-selector]');
  const appRoot = document.querySelector('.app');
  const content = document.querySelector('#content, #plan-content, [data-plan-content]');

  if (!personControl || !dayControl || !content) return;

  const DURATION_MS = 180;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isAnimating = false;

  const plans = {
    Noel: {
      Monday: [
        ['Back Squat', '5x5', 'RPE 7', '2 min'],
        ['Romanian Deadlift', '4x8', 'Slow eccentric', '90s'],
        ['Plank', '3x45s', 'Brace hard', '60s']
      ],
      Wednesday: [
        ['Bench Press', '5x5', 'Pause 1s', '2 min'],
        ['DB Row', '4x10', 'Each side', '90s'],
        ['Dead Bug', '3x10', 'Controlled', '60s']
      ],
      Friday: [
        ['Deadlift', '5x3', 'Build to top set', '2 min'],
        ['Split Squat', '3x10', 'Each leg', '90s'],
        ['Farmer Carry', '4x20m', 'Heavy', '60s']
      ]
    },
    Ornella: {
      Monday: [
        ['Hip Thrust', '4x10', '1s pause at top', '90s'],
        ['Goblet Squat', '4x12', 'Full depth', '75s'],
        ['Band Walk', '3x20', 'Constant tension', '45s']
      ],
      Wednesday: [
        ['Pull-down', '4x10', 'Scapula first', '90s'],
        ['Incline DB Press', '4x10', 'Neutral grip', '90s'],
        ['Face Pull', '3x15', 'Light and strict', '60s']
      ],
      Friday: [
        ['Kettlebell Deadlift', '4x12', 'Neutral spine', '90s'],
        ['Step-up', '3x12', 'Each leg', '75s'],
        ['Pallof Press', '3x12', 'Each side', '60s']
      ]
    }
  };

  const people = Object.keys(plans);
  const days = ['Monday', 'Wednesday', 'Friday'];

  const populateControl = (element, values) => {
    element.innerHTML = values.map((value) => `<option value="${value}">${value}</option>`).join('');
  };

  const renderPlan = (person, day) => {
    const rows = plans[person]?.[day] ?? [];
    const tableRows = rows
      .map(
        ([exercise, sets, notes, rest]) => `
          <tr>
            <td>${exercise}</td>
            <td>${sets}</td>
            <td>${notes}</td>
            <td>${rest}</td>
          </tr>
        `
      )
      .join('');

    content.innerHTML = `
      <h2>${person} · ${day}</h2>
      <p class="meta">Strength focus with simple progression and short notes for execution.</p>
      <div class="table-wrap" role="region" aria-label="Workout details" tabindex="0">
        <table class="plan-table">
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Sets/Reps</th>
              <th>Notes</th>
              <th>Rest</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  };

  const swapContent = () => {
    if (isAnimating) return;

    const person = personControl.value;
    const day = dayControl.value;

    if (reducedMotion.matches) {
      renderPlan(person, day);
      return;
    }

    isAnimating = true;
    content.classList.add('is-transitioning-out');
    content.classList.remove('is-transitioning-in');

    window.setTimeout(() => {
      renderPlan(person, day);
      content.classList.remove('is-transitioning-out');
      content.classList.add('is-transitioning-in');

      window.setTimeout(() => {
        content.classList.remove('is-transitioning-in');
        isAnimating = false;
      }, DURATION_MS);
    }, DURATION_MS);
  };

  const setTheme = () => {
    if (!appRoot || !themeControl) return;
    appRoot.setAttribute('data-theme', themeControl.value);
  };

  populateControl(personControl, people);
  populateControl(dayControl, days);
  personControl.value = people[0];
  dayControl.value = days[0];

  renderPlan(personControl.value, dayControl.value);
  setTheme();

  personControl.addEventListener('change', swapContent);
  dayControl.addEventListener('change', swapContent);
  themeControl?.addEventListener('change', setTheme);
})();
