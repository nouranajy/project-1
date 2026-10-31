    $(function () {

      /* ---------- 1. typing effect ---------- */
      const words = ['pink world', 'soft space', 'rosy corner'];
      let wi = 0, ci = 0, deleting = false;
      function typeLoop() {
        const word = words[wi];
        $('#typingTarget').text(word.substring(0, ci));
        if (!deleting && ci < word.length) { ci++; setTimeout(typeLoop, 90); }
        else if (!deleting && ci === word.length) { deleting = true; setTimeout(typeLoop, 1200); }
        else if (deleting && ci > 0) { ci--; setTimeout(typeLoop, 45); }
        else { deleting = false; wi = (wi + 1) % words.length; setTimeout(typeLoop, 300); }
      }
      typeLoop();

      /* ---------- 1b. shuffle pink background ---------- */
      const pinks = ['#fff0f5', '#ffe4e9', '#ffd9e2', '#ffeef2', '#ffb6c1'];
      $('#shuffleColors').on('click', function () {
        $('body').css('background', pinks[Math.floor(Math.random() * pinks.length)]);
      });

      /* ---------- 2. counter animation ---------- */
      $('.counter').each(function () {
        const $el = $(this);
        const target = +$el.data('target');
        $({ n: 0 }).animate({ n: target }, {
          duration: 1400,
          easing: 'swing',
          step: function () { $el.text(Math.floor(this.n)); },
          complete: function () { $el.text(target); }
        });
      });

      /* ---------- 3. slideToggle panels ---------- */
      $('.toggle-btn').on('click', function () {
        const target = $(this).data('target');
        $(target).slideToggle(250);
      });

      /* ---------- 4. custom tabs ---------- */
      $('.tab-btn').on('click', function () {
        const target = $(this).data('tab');
        // hide all, show target
        $('.tab-pane-custom').hide();
        $(target).fadeIn(200);
        // reset styles
        $('.tab-btn')
          .removeClass('active')
          .css({ background: 'transparent', color: '#a54f68' });
        $(this)
          .addClass('active')
          .css({ background: '#ffb6c1', color: '#4a1e2b' });
      });

      /* ---------- 5. list builder ---------- */
      $('#addLove').on('click', function () {
        const val = $('#loveInput').val().trim();
        if (!val) return;
        const $li = $(
          '<li class="list-group-item d-flex justify-content-between align-items-center">' +
            '<span></span>' +
            '<span class="remove-love badge rounded-pill" style="background:#ff8da1; cursor:pointer;">✕</span>' +
          '</li>'
        );
        $li.css({ background: '#ffe2eb', borderColor: '#ffc1cc' });
        $li.find('span').first().text(val);
        $li.hide().appendTo('#loveList').fadeIn(200);
        $('#loveInput').val('');
      });

      $('#loveInput').on('keypress', function (e) {
        if (e.which === 13) { e.preventDefault(); $('#addLove').click(); }
      });

      $('#loveList').on('click', '.remove-love', function () {
        $(this).closest('li').fadeOut(180, function () { $(this).remove(); });
      });

      $('#clearLove').on('click', function () {
        $('#loveList li').fadeOut(150, function () { $(this).remove(); });
      });

      /* ---------- 6. fake ajax with $.Deferred ---------- */
      const facts = [
        'Pink was once considered a masculine color in the West.',
        'The color pink is named after the flower of the same name.',
        'Flamingos are pink because of the shrimp they eat.',
        '“Millennial pink” became a design trend around 2016.',
        'Pink diamonds are among the rarest gemstones on Earth.'
      ];
      $('#loadFact').on('click', function () {
        const $btn = $(this).prop('disabled', true).text('Loading…');
        const $box = $('#factBox').fadeOut(150, function () { $box.text('…'); $box.fadeIn(150); });
        const $box2 = $('#factBox');
        setTimeout(function () {
          $box2.fadeOut(150, function () {
            $box2.text(facts[Math.floor(Math.random() * facts.length)]).fadeIn(200);
          });
          $btn.prop('disabled', false).text('Load fact 💡');
        }, 700);
      });

      /* ---------- 7. hover fade ---------- */
      $('#hoverCard')
        .on('mouseenter', function () { $(this).fadeTo(250, 0.55); })
        .on('mouseleave', function () { $(this).fadeTo(250, 1); });

    });