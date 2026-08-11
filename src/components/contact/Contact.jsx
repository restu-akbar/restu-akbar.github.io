import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";

import "./Contact.css";
import "react-toastify/dist/ReactToastify.css";

const Contact = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            return toast.error("Please complete the form above");
        }

        setLoading(true);

        const data = {
            name,
            email,
            subject,
            message,
        };

        emailjs
            .send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                data,
                process.env.REACT_APP_EMAILJS_PUBLIC_API
            )
            .then(
                (result) => {
                    setLoading(false);
                    setName("");
                    setEmail("");
                    setSubject("");
                    setMessage("");
                    toast.success(`Successfully sent email.`);
                },
                (error) => {
                    setLoading(false);
                    console.log(error);
                    toast.error(error.text);
                }
            );
    };

    return (
        <section className="contact container section" id="contact">
            <div className="section__heading">
                <span className="section__eyebrow">Contact</span>
                <h2 className="section__title">Let&apos;s build something useful.</h2>
                <p className="section__description">
                    Have a project, role, or technical problem to discuss? Send a
                    message and I&apos;ll get back to you.
                </p>
            </div>

            <div className="contact__container grid">
                <div className="contact__info">
                    <span className="contact__label">Direct email</span>
                    <h3 className="contact__title">Prefer email?</h3>
                    <p className="contact__details">
                        You can reach me directly at:
                    </p>
                    <a
                        className="contact__email"
                        href="mailto:restu.akbar.03.04@gmail.com"
                    >
                        restu.akbar.03.04@gmail.com
                    </a>
                </div>

                <form onSubmit={submitHandler} className="contact__form">
                    <div className="contact__form-group">
                        <div className="contact__form-div">
                            <label htmlFor="contact-name">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                className="contact__form-input"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="contact__form-div">
                            <label htmlFor="contact-email">Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                className="contact__form-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="contact__form-div">
                        <label htmlFor="contact-subject">Subject</label>
                        <input
                            id="contact-subject"
                            type="text"
                            className="contact__form-input"
                            placeholder="What would you like to discuss?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div className="contact__form-div contact__form-area">
                        <label htmlFor="contact-message">Message</label>
                        <textarea
                            name="message"
                            id="contact-message"
                            cols="30"
                            rows="6"
                            className="contact__form-input"
                            placeholder="Tell me a little about your project or opportunity."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
                <ToastContainer position="bottom-right" theme={props.theme} />
            </div>
            <p className="foot">Designed and built by Restu Akbar.</p>
        </section>
    );
};

export default Contact;
