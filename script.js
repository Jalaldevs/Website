document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   Phone screenshot carousel — auto-advances every 3s
   --------------------------------------------------------- */
(function phoneCarousel(){
  const slides  = Array.from(document.querySelectorAll('.phone-slide'));
  const dots    = Array.from(document.querySelectorAll('.dot'));
  const caption = document.getElementById('captionText');
  const device  = document.querySelector('.hero-device');
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 3000;

  function show(i){
    slides[index].classList.remove('is-active');
    dots[index]?.classList.remove('is-active');

    index = (i + slides.length) % slides.length;

    slides[index].classList.add('is-active');
    dots[index]?.classList.add('is-active');
    caption.textContent = slides[index].dataset.caption;
  }

  function next(){ show(index + 1); }

  function start(){
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop(){ if (timer) clearInterval(timer); timer = null; }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      show(parseInt(dot.dataset.index, 10));
      start(); // reset the interval after manual pick
    });
  });

  // pause on hover / focus, resume on leave
  device.addEventListener('mouseenter', stop);
  device.addEventListener('mouseleave', start);
  device.addEventListener('focusin', stop);
  device.addEventListener('focusout', start);

  start();
})();

/* ---------------------------------------------------------
   Phone 3D tilt on cursor move (GSAP quickTo)
   --------------------------------------------------------- */
(function phoneTilt(){
  const phone = document.getElementById('phone');
  const hero  = document.querySelector('.hero-device');
  if (!phone || !hero || reduceMotion || typeof gsap === 'undefined') return;

  const rotX = gsap.quickTo(phone, 'rotateX', { duration: .6, ease: 'power3.out' });
  const rotY = gsap.quickTo(phone, 'rotateY', { duration: .6, ease: 'power3.out' });

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotY(relX * 16);
    rotX(relY * -16);
  });

  hero.addEventListener('mouseleave', () => {
    rotX(0);
    rotY(0);
  });
})();

/* ---------------------------------------------------------
   Hero entrance sequence
   --------------------------------------------------------- */
(function heroIntro(){
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: reduceMotion ? 0.01 : 0.9 }
  });

  tl.from('.eyebrow', { y: 16, opacity: 0 })
    .from('.hero-title', { y: 24, opacity: 0 }, '-=0.6')
    .from('.hero-sub', { y: 20, opacity: 0 }, '-=0.6')
    .from('.store-badges .store-badge', { y: 16, opacity: 0, stagger: 0.08 }, '-=0.5')
    .from('.chip-row .chip', { y: 12, opacity: 0, stagger: 0.06 }, '-=0.5')
    .from('.hero-device', { scale: .92, opacity: 0, duration: 1 }, '-=0.8');
})();

/* ---------------------------------------------------------
   Scroll reveal for sections below the fold
   --------------------------------------------------------- */
(function scrollReveal(){
  const targets = document.querySelectorAll(
    '.featured-copy, .featured-tags, .project-card, .stack-block, .contact-inner'
  );
  targets.forEach(el => el.classList.add('reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)){
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => io.observe(el));
})();