(function () {
    /* --- Animación de Estrellas en el Banner --- */
    const canvas = document.getElementById('starsCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const banner = document.querySelector('.banner');
        const STAR_COUNT = 180;
        let stars = [];
        let animId;

        /* Paleta de colores acorde al diseño */
        const COLORS = ['#e0e7ff', '#8679d9', '#ffffff', '#c4b5fd', '#a89ded'];

        function resize() {
            canvas.width = banner.offsetWidth;
            canvas.height = banner.offsetHeight;
            initStars();
        }

        function rand(min, max) { return Math.random() * (max - min) + min; }

        function initStars() {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                const layer = Math.floor(rand(0, 3)); /* 0=lejos 1=medio 2=cerca */
                stars.push({
                    x: rand(0, canvas.width),
                    y: rand(0, canvas.height),
                    r: layer === 0 ? rand(0.4, 0.9) : layer === 1 ? rand(0.8, 1.5) : rand(1.4, 2.4),
                    color: COLORS[Math.floor(rand(0, COLORS.length))],
                    speed: layer === 0 ? rand(0.04, 0.10) : layer === 1 ? rand(0.10, 0.20) : rand(0.20, 0.35),
                    twinkleSpeed: rand(0.005, 0.025),
                    twinklePhase: rand(0, Math.PI * 2),
                    baseAlpha: layer === 0 ? rand(0.25, 0.55) : layer === 1 ? rand(0.45, 0.75) : rand(0.70, 1.0),
                });
            }
        }

        function draw(ts) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const t = ts * 0.001;

            stars.forEach(s => {
                /* Parpadeo suave */
                const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed * 60 + s.twinklePhase));

                /* Movimiento lento hacia abajo (efecto campo estelar) */
                s.y += s.speed;
                if (s.y > canvas.height + 2) { s.y = -2; s.x = rand(0, canvas.width); }

                /* Dibujo */
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = s.color;
                ctx.shadowColor = s.color;
                ctx.shadowBlur = s.r * 3;
                ctx.fill();
                ctx.restore();
            });

            animId = requestAnimationFrame(draw);
        }

        /* Arranque de animación */
        resize();
        animId = requestAnimationFrame(draw);

        /* Redimensionado responsivo del canvas */
        const ro = new ResizeObserver(resize);
        ro.observe(banner);
    }

    /* --- Animación de Revelado (Reveal) al hacer Scroll --- */
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); /* Solo animar una vez */
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 /* Se activa cuando el 15% del elemento es visible */
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

})();
