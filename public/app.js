// ۱. امپورت کردن ماژول‌های مورد نیاز فایربیس از CDN گوگل
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// کانفیگ اختصاصی پروژه شما از تصویر zzzzzz_6.jpg
const firebaseConfig = {
  apiKey: 'AIzaSyDBi03wWRmoylTtpuRS-JvXiwF8pfc2mPY',
  authDomain: 'amirp-portfolio.firebaseapp.com',
  projectId: 'amirp-portfolio',
  storageBucket: 'amirp-portfolio.firebasestorage.app',
  messagingSenderId: '414375744930',
  appId: '1:414375744930:web:5bf82209a434f1d1e24efb',
  measurementId: 'G-N3ZZECPJD9',
};

// ۲. راه‌اندازی فایربیس و اتصال به دیتابیس Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// کدهای مربوط به منوی همبرگری و انیمیشن اسکرول پورتفولیو
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const reveals = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contact-form'); // تغییر به انتخاب با آیدی اختصاصی

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

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

// ۳. مدیریت بخش ارسال فرم و ثبت داده‌ها در Firestore دیتابیس
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // جلوگیری از رفتار پیش‌فرض فرم و رفرش شدن صفحه

    const btn = this.querySelector('.btnForm');
    const originalBtnText = btn.textContent;
    const resultEl = document.getElementById('contact-result');

    // تغییر دکمه به حالت در حال ارسال
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // گرفتن مقادیر ورودی‌ها در زمان کلیک کاربر
    const nameVal = document.getElementById('name').value;
    const emailVal = document.getElementById('email').value;
    const messageVal = document.getElementById('message').value;

    try {
      // ذخیره اطلاعات داخل کالکشن "messages" در فایراستور دیتابیس
      await addDoc(collection(db, 'messages'), {
        name: nameVal,
        email: emailVal,
        message: messageVal,
        createdAt: new Date(), // ذخیره زمان ارسال پیام
      });

      // نمایش پیغام موفقیت‌آمیز بودن ارسال
      if (resultEl) {
        resultEl.textContent = 'Your message has been sent successfully!';
        resultEl.style.color = '#9ae6b4';
        resultEl.style.display = 'block';
      }

      // خالی کردن فرم بعد از ارسال موفق
      contactForm.reset();
    } catch (error) {
      console.error('Error saving data to Firestore: ', error);
      if (resultEl) {
        resultEl.textContent = 'Something went wrong. Please try again.';
        resultEl.style.color = '#fc8181';
        resultEl.style.display = 'block';
      }
    } finally {
      // بازگرداندن دکمه به حالت اولیه بعد از اتمام عملیات
      setTimeout(() => {
        btn.textContent = originalBtnText;
        btn.style.opacity = '1';
        btn.disabled = false;
        if (resultEl) {
          resultEl.style.display = 'none';
        }
      }, 3000);
    }
  });
}

// کدهای مربوط به کلیک روی کارت‌های پروژه
document.querySelectorAll('.project-card').forEach((card) => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const link = card.querySelector('.project-link a');
    if (link && link.href) {
      window.open(link.href, '_blank', 'noopener');
    }
  });
});
