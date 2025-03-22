import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Typed from 'typed.js';
import "./home.css";

function Home() {
    const [isVisible, setIsVisible] = useState(false);
    const testimonialsRef = useRef(null);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Sample testimonials data
    const testimonials = [
        {
            quote: "AutoBudget helped me save for my dream vacation!",
            author: "Sarah T.",
            rating: 5
        },
        {
            quote: "I finally have control over my finances thanks to this app.",
            author: "Michael R.",
            rating: 5
        },
        {
            quote: "The insights feature helped me cut unnecessary expenses.",
            author: "Jessica M.",
            rating: 4
        },
        {
            quote: "Best budgeting tool I've used in years!",
            author: "David K.",
            rating: 5
        }
    ];

    // Typing animation effect
    useEffect(() => {
        const typed = new Typed('.typing-text', {
            strings: [
                'Track expenses effortlessly',
                'Visualize spending patterns',
                'Set and achieve financial goals',
                'Plan for your future'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            cursorBlinking: true
        });

        return () => {
            typed.destroy();
        };
    }, []);

    // Fade-in animation on load
    useEffect(() => {
        setTimeout(() => setIsVisible(true), 300);
    }, []);

    // Auto-scroll testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Generate stars based on rating
    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className={`home ${isVisible ? 'visible' : ''}`}>
            <Helmet>
                <title>Home - AutoBudget</title>
            </Helmet>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Take Control of Your Finances</h1>
                    <div className="typing-text"></div>
                    <p className="hero-description">
                        AutoBudget helps you track expenses, set goals, and achieve financial freedom with ease.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/dashboard" className="cta-primary">Get Started</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/images/budget-app.webp" alt="Budget App" />
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Why Choose AutoBudget?</h2>
                <div className="feature-cards">
                    <div className="card">
                        <div className="card-icon">📱</div>
                        <h3>Mobile Friendly</h3>
                        <p>Access your budget anytime, anywhere.</p>
                    </div>
                    <div className="card">
                        <div className="card-icon">🔒</div>
                        <h3>Secure & Private</h3>
                        <p>Your data is always safe with us.</p>
                    </div>
                    <div className="card">
                        <div className="card-icon">📊</div>
                        <h3>Smart Insights</h3>
                        <p>Get personalized financial advice.</p>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="testimonials-section" ref={testimonialsRef}>
                <h2>What Our Users Say</h2>
                <div className="testimonials-container">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
                        >
                            <p className="quote">"{testimonial.quote}"</p>
                            <p className="author">— {testimonial.author}</p>
                            <div className="rating">{renderStars(testimonial.rating)}</div>
                        </div>
                    ))}
                </div>
                <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                            onClick={() => setCurrentTestimonial(index)}
                        ></span>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2025 AutoBudget. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;