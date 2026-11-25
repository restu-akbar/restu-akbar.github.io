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
            <span className="section__eyebrow">Contact</span>
            <h2 className="section__title">Tell me what you&apos;re trying to solve.</h2>

            <div className="contact__container">
                <p className="contact__lead">
                    The quickest way to reach me is{" "}
                    <a className="text-link" href="mailto:restu.akbar.03.04@gmail.com">
                        restu.akbar.03.04@gmail.com
                    </a>
                    . A half-formed problem is fine. Or use the form below.
                </p>

                <form onSubmit={submitHandler} className="contact__form">
                    <div className="contact__form-group">
                        <div className="contact__form-div">
                            <label htmlFor="contact-name">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                className="contact__form-input"
                                
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
                                
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="contact__form-div">
                        <label htmlFor="contact-subject">What do you need help with?</label>
                        <input
                            id="contact-subject"
                            type="text"
                            className="contact__form-input"
                            
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div className="contact__form-div contact__form-area">
                        <label htmlFor="contact-message">Details</label>
                        <textarea
                            name="message"
                            id="contact-message"
                            cols="30"
                            rows="6"
                            className="contact__form-input"
                            
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Sending..." : "Send message"}
                    </button>
                </form>
                <ToastContainer position="bottom-right" theme={props.theme} />
            </div>
            <p className="foot mono">© Restu Akbar · Forward deployed engineer</p>
        </section>
    );
};

export default Contact;
