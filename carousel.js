    (function() {
      const track = document.getElementById('carouselTrack');
      const slides = track ? Array.from(track.children) : [];
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const dotsContainer = document.getElementById('carouselDots');

      if (!track || slides.length === 0) return;

      let currentIndex = 0;
      const totalSlides = slides.length;

      // Create dots
      function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.classList.add('dot');
          if (i === 0) dot.classList.add('active');
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => goToSlide(i));
          dotsContainer.appendChild(dot);
        });
      }

      // Update active dot
      function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }

      // Move to specific slide
      function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
      }

      // Next / prev
      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      // Event listeners
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      if (nextBtn) nextBtn.addEventListener('click', nextSlide);

      // Optional: keyboard arrows
      window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      });

      // Auto-advance every 5 seconds (uncomment if desired)
      // let autoInterval = setInterval(nextSlide, 5000);
      // pause on hover
      // const container = document.querySelector('.carousel-container');
      // if (container) {
      //   container.addEventListener('mouseenter', () => clearInterval(autoInterval));
      //   container.addEventListener('mouseleave', () => {
      //     autoInterval = setInterval(nextSlide, 5000);
      //   });
      // }

      // Initialize
      createDots();
      // Make sure first slide is shown
      goToSlide(0);
    })();