const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const reveals = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-links a');
const contactForm = document.querySelector('.contact-form');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
});

reveals.forEach((el) => {
  observer.observe(el);
});

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinksAll.forEach((link) => {
    link.classList.remove('active');

    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

navLinksAll.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    const btn = this.querySelector('.btnForm');
    const originalBtnText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      alert('Thank you! Your message has been sent successfully.');
      btn.textContent = originalBtnText;
      btn.style.opacity = '1';
      btn.disabled = false;
      contactForm.reset();
    }, 2000);
  });
}
