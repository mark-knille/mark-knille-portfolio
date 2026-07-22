const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('section[id]');
const year = document.getElementById('year');

if (menuBtn && navMenu) {
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

function setActiveLink() {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

if (sections.length) {
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name || 'Website Visitor'}`);
    const body = encodeURIComponent(
`Name: ${name}
Email: ${email}

Message:
${message}`
    );

    window.location.href = `mailto:markknille@gmail.com?subject=${subject}&body=${body}`;
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}
