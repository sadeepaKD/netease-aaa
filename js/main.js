/* ================================
   NetEase AAA — Interactive Canvas
   Animated network topology background
   ================================ */

(function () {
    'use strict';

    // -------- NETWORK CANVAS --------
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let w, h;
    const NODE_COUNT = 55;
    const CONNECT_DIST = 160;
    const ACCENT = [0, 212, 170];

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }

    function createNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1.5,
            });
        }
    }

    function drawNetwork() {
        ctx.clearRect(0, 0, w, h);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},0.6)`;
            ctx.fill();

            // Update
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;
        }

        requestAnimationFrame(drawNetwork);
    }

    window.addEventListener('resize', () => { resize(); });
    resize();
    createNodes();
    drawNetwork();

    // -------- SCROLL ANIMATIONS --------
    const fadeEls = document.querySelectorAll(
        '.about-grid, .problem-card, .feature-card, .flow-step, ' +
        '.tech-item, .screenshot-card, .team-card, .arch-zone, .stat-card'
    );

    fadeEls.forEach((el) => el.classList.add('fade-in'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach((el) => observer.observe(el));

    // -------- STAT COUNTER --------
    const statNums = document.querySelectorAll('.stat-number[data-target]');
    const statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseInt(el.dataset.target, 10);
                    let current = 0;
                    const step = Math.max(1, Math.ceil(target / 30));
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        el.textContent = current;
                    }, 40);
                    statObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );
    statNums.forEach((el) => statObserver.observe(el));

    // -------- NAV TOGGLE --------
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // -------- NAV ACTIVE STATE --------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach((sec) => {
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            const id = sec.getAttribute('id');
            navItems.forEach((a) => {
                if (a.getAttribute('href') === '#' + id) {
                    if (scrollY >= top && scrollY < bottom) {
                        a.style.color = 'var(--accent)';
                    } else {
                        a.style.color = '';
                    }
                }
            });
        });

        // Nav background opacity
        const nav = document.getElementById('topnav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(10,14,23,0.95)';
            } else {
                nav.style.background = 'rgba(10,14,23,0.85)';
            }
        }
    });

    // -------- SMOOTH SCROLL for nav links --------
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

})();
