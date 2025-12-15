(() => {
    const body = document.body;
    const $ = (id) => document.getElementById(id);
  
    /* =============================
       THEME MODE
    ============================= */
    const themeToggle = $('themeToggle');
  
    function setMode(mode) {
      body.classList.toggle('light', mode === 'light');
      localStorage.setItem('colorThemeMode', mode);
    }
  
    setMode(localStorage.getItem('colorThemeMode') === 'light' ? 'light' : 'dark');
  
    themeToggle?.addEventListener('click', () => {
      setMode(body.classList.contains('light') ? 'dark' : 'light');
    });
  
    /* =============================
       COLOR THEMES
    ============================= */
    const themeStyleToggle = $('themeStyleToggle');
    const themes = ['purple', 'neon', 'cyberpunk'];
    const icons = { purple: '🟣', neon: '⚡', cyberpunk: '🌆' };
  
    function applyTheme(name) {
      const safe = themes.includes(name) ? name : 'purple';
      body.classList.remove('theme-purple', 'theme-neon', 'theme-cyberpunk');
      body.classList.add('theme-' + safe);
      if (themeStyleToggle) themeStyleToggle.textContent = icons[safe] || '🎨';
      localStorage.setItem('colorThemeStyle', safe);
      return safe;
    }
  
    let currentTheme = applyTheme(localStorage.getItem('colorThemeStyle') || 'purple');
  
    themeStyleToggle?.addEventListener('click', () => {
      currentTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
      applyTheme(currentTheme);
    });
  
    /* =============================
       LOFI RADIO
    ============================= */
    const radioToggle = $('radioToggle');
    const radioPanel = $('radioPanel');
    const radioClose = $('radioClose');
    const radioPlayPause = $('radioPlayPause');
    const radioNext = $('radioNext');
    const radioVolume = $('radioVolume');
    const radioTrackName = $('radioTrackName');
    const audio = $('lofiAudio');
  
    const tracks = [
      { title: 'Midnight Coding', file: 'assets/lofi-1.mp3' },
      { title: 'Soft Keyboard Rain', file: 'assets/lofi-2.mp3' },
      { title: 'City Lights Lofi', file: 'assets/lofi-3.mp3' }
    ];
  
    let trackIndex = 0;
    let playing = false;
  
    function loadTrack() {
      if (!audio || !tracks.length) return;
      audio.src = tracks[trackIndex].file;
      if (radioTrackName) radioTrackName.textContent = tracks[trackIndex].title;
      audio.load();
    }
  
    radioToggle?.addEventListener('click', () => {
      radioPanel?.classList.toggle('radio-panel--open');
    });
  
    radioClose?.addEventListener('click', () => {
      radioPanel?.classList.remove('radio-panel--open');
    });
  
    radioPlayPause?.addEventListener('click', () => {
      if (!audio) return;
      if (!audio.src) loadTrack();
  
      if (!playing) {
        audio.play().catch(() => {});
        playing = true;
      } else {
        audio.pause();
        playing = false;
      }
      if (radioPlayPause) radioPlayPause.textContent = playing ? '⏸' : '▶';
    });
  
    radioNext?.addEventListener('click', () => {
      if (!audio) return;
      trackIndex = (trackIndex + 1) % tracks.length;
      loadTrack();
      if (playing) audio.play().catch(() => {});
    });
  
    if (audio) {
      audio.volume = (Number(radioVolume?.value ?? 40) || 40) / 100;
  
      radioVolume?.addEventListener('input', (e) => {
        const v = Number(e.target.value) || 0;
        audio.volume = v / 100;
      });
  
      audio.addEventListener('ended', () => {
        trackIndex = (trackIndex + 1) % tracks.length;
        loadTrack();
        audio.play().catch(() => {});
      });
    }
  
    /* =============================
       SMOOTH SCROLL
    ============================= */
    document.addEventListener('click', (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
  
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
  
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  
    $('startLearning')?.addEventListener('click', () => $('about')?.scrollIntoView({ behavior: 'smooth' }));
    $('scrollToLab')?.addEventListener('click', () => $('lab')?.scrollIntoView({ behavior: 'smooth' }));
  
    /* =============================
       REVEAL
    ============================= */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('visible');
            o.unobserve(en.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach((el) => obs.observe(el));
    }
  
    /* =============================
       EXAMPLES TABS
    ============================= */
    const exampleText = $('exampleText');
    const exampleCode = $('exampleCode');
  
    const examples = {
      recs: {
        text: 'ИИ анализирует историю просмотров, лайков и времени просмотра, чтобы понять предпочтения и рекомендовать похожий контент.',
        code: `similarity = cosine_similarity(userA, userB)\nrecommend(similar_users)`
      },
      vision: {
        text: 'Компьютерное зрение распознаёт объекты, лица, номера, знаки — по изображению/видео.',
        code: `img -> preprocess -> model.predict -> decode_objects`
      },
      health: {
        text: 'В медицине ИИ помогает находить признаки заболеваний на снимках и анализировать данные пациента.',
        code: `risk = model.predict_proba(features)\nif risk>0.7: alert_doctor()`
      },
      cars: {
        text: 'Автопилот объединяет камеры/лидар/радар, распознаёт окружение и строит траекторию движения.',
        code: `sensors -> detect_objects -> planner -> control`
      }
    };
  
    function setTab(id) {
      if (!examples[id] || !exampleText || !exampleCode) return;
      document.querySelectorAll('.tab').forEach(t =>
        t.classList.toggle('active', t.dataset.example === id)
      );
      exampleText.textContent = examples[id].text;
      exampleCode.textContent = examples[id].code;
    }
  
    document.addEventListener('click', (e) => {
      const tab = e.target.closest?.('.tab');
      if (tab) setTab(tab.dataset.example);
  
      const pill = e.target.closest?.('.pill-link[data-example]');
      if (pill) {
        setTab(pill.dataset.example);
        $('examples')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  
    /* =============================
       INTERACTIVE AI CHAT (history)
    ============================= */
    const aiInput = $('aiInput');
    const aiAskBtn = $('aiAskBtn');
    const aiChat = $('aiChat');
    const aiThinking = $('aiThinking');
    const aiStatusText = $('aiStatusText');
    const aiHints = document.querySelectorAll('.ai-hints-list li');
  
    const knowledge = [
      {
        keys: ['что такое', 'искусственный интеллект', 'ии'],
        answer: 'ИИ — это технологии, которые позволяют компьютерам учиться на данных и решать задачи: распознавать, прогнозировать, генерировать текст.'
      },
      {
        keys: ['где используется', 'где используют', 'применяют', 'используется'],
        answer: 'ИИ используют в рекомендациях (YouTube/Netflix), смартфонах (камера), медицине (анализ снимков), банках (скоринг), транспорте (ассистенты водителя).'
      },
      {
        keys: ['плюсы', 'преимущества'],
        answer: 'Плюсы: скорость анализа данных, автоматизация рутины, помощь человеку в решениях, повышение точности в типовых задачах.'
      },
      {
        keys: ['минусы', 'недостатки'],
        answer: 'Минусы: ошибки, зависимость от данных, возможная предвзятость, отсутствие “понимания” как у человека.'
      },
      {
        keys: ['опасен', 'опасность', 'безопасно'],
        answer: 'Опасность чаще в неправильном использовании. Проверяй факты, не делись приватными данными и помни: ответственность всегда на человеке.'
      }
    ];
  
    function findAnswer(q) {
      const text = q.toLowerCase();
      for (const item of knowledge) {
        if (item.keys.some(k => text.includes(k))) return item.answer;
      }
      return 'Я пока отвечаю на базовые вопросы про ИИ. Попробуй спросить: “Что такое ИИ?”, “Где используется ИИ?”, “Плюсы/минусы ИИ?”.';
    }
  
    function addBubble(role, text) {
      if (!aiChat) return;
      const div = document.createElement('div');
      div.className = `ai-bubble ${role}`;
      div.textContent = text;
      aiChat.appendChild(div);
      aiChat.scrollTop = aiChat.scrollHeight;
    }
  
    function setThinking(on) {
      if (!aiThinking) return;
      aiThinking.style.display = on ? 'block' : 'none';
    }
  
    function askAI(question) {
      const q = (question || '').trim();
      if (!q) return;
  
      addBubble('user', q);
      if (aiStatusText) aiStatusText.textContent = 'ИИ думает…';
      setThinking(true);
  
      // имитация “подумать”
      setTimeout(() => {
        const ans = findAnswer(q);
        setThinking(false);
        addBubble('bot', ans);
        if (aiStatusText) aiStatusText.textContent = 'Готово. Можно спросить ещё.';
      }, 450);
    }
  
    aiAskBtn?.addEventListener('click', () => {
      askAI(aiInput?.value);
      if (aiInput) aiInput.value = '';
    });
  
    aiInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        askAI(aiInput.value);
        aiInput.value = '';
      }
    });
  
    aiHints.forEach((li) => {
      li.addEventListener('click', () => askAI(li.dataset.q || li.textContent));
    });
  
    // приветствие в чат
    if (aiChat && aiChat.children.length === 0) {
      addBubble('bot', 'Привет! Я мини-ИИ. Нажми на пример вопроса ниже или напиши свой 🙂');
    }
  
    /* =============================
       QUIZ: progress + highlight
    ============================= */
    const quizBtn = $('checkQuiz');
    const quizResult = $('quizResult');
    const progressBar = $('quizProgressBar');
  
    function updateProgress() {
      const qs = document.querySelectorAll('.quiz-question');
      const total = qs.length || 1;
      let answered = 0;
  
      qs.forEach(q => {
        if (q.querySelector('input:checked')) answered++;
      });
  
      const pct = Math.round((answered / total) * 100);
      if (progressBar) progressBar.style.width = pct + '%';
    }
  
    document.addEventListener('change', (e) => {
      if (e.target && e.target.matches('.quiz input[type="radio"]')) {
        updateProgress();
      }
    });
  
    quizBtn?.addEventListener('click', () => {
      const qs = document.querySelectorAll('.quiz-question');
      const total = qs.length || 1;
  
      let correct = 0;
      let answered = 0;
  
      qs.forEach(q => {
        q.classList.remove('correct', 'wrong');
  
        const right = q.dataset.correct;
        const chosen = q.querySelector('input:checked');
  
        if (chosen) {
          answered++;
          if (chosen.value === right) {
            correct++;
            q.classList.add('correct');
          } else {
            q.classList.add('wrong');
          }
        }
      });
  
      if (answered < total) {
        if (quizResult) {
          quizResult.textContent = 'Ответь на все вопросы 🙂';
          quizResult.className = 'quiz-result error';
        }
        return;
      }
  
      if (quizResult) {
        quizResult.textContent =
          `Результат: ${correct}/${total}. ` +
          (correct === total ? 'Отлично! 👏' : correct >= Math.ceil(total / 2) ? 'Хорошо 😉' : 'Нужно повторить теорию 😊');
  
        quizResult.className = (correct === total) ? 'quiz-result success' : 'quiz-result';
      }
    });
  
    updateProgress();
  })();
  