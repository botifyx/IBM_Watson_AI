import React, { useRef, useEffect } from 'react';

interface AnimatedHeroProps {
    onExplore: () => void;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ onExplore }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: -1000, y: -1000, radius: 150 };
        let hue = 200; // Start with a blueish hue

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || 600;
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };
        
        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        resizeCanvas();

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = 0;
                this.speedY = 0;
                this.color = `hsl(${hue}, 100%, 70%)`;
            }

            update() {
                // Perlin noise-like movement
                const angle = (Math.cos(this.x * 0.002) + Math.sin(this.y * 0.002)) * 2;
                this.speedX = Math.cos(angle) * 0.7;
                this.speedY = Math.sin(angle) * 0.7;

                this.x += this.speedX;
                this.y += this.speedY;
                
                // mouse interaction - repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 2;
                    this.y += (dy / distance) * force * 2;
                }

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 4000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            // Fading effect for trails
            ctx.fillStyle = 'rgba(4, 16, 38, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            hue += 0.1; // Slowly shift hue for iridescent effect
            particles.forEach(p => p.color = `hsl(${hue}, 100%, 70%)`);

            animationFrameId = requestAnimationFrame(animate);
        }

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="relative text-center py-16 md:py-24 h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 bg-slate-900" />
            <div className="relative z-10 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight" style={{textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'}}>
                    The Unofficial Guide to <span className="text-blue-400" style={{textShadow: '0 0 15px rgba(59, 130, 246, 0.7)'}}>IBM Watson AI</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-200" style={{textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'}}>
                    A comprehensive, modern resource dedicated to exploring the past, present, and future of one of AI's most iconic platforms.
                </p>
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onExplore}
                        className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-blue-500 transition-transform duration-200 transform hover:scale-105 shadow-lg shadow-blue-600/30 ring-1 ring-blue-500/50"
                    >
                        Explore Watson
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AnimatedHero;
