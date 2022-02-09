import React, { useState } from "react";
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import "../../assets/css/pages.css";
import { useForm } from 'react-hook-form';
import { init, sendForm } from 'emailjs-com';
import { Helmet } from "react-helmet"
init(process.env.REACT_APP_INIT);

const Contact = () => {

    const [contactNumber, setContactNumber] = useState("000000");
    const [statusMessage, setStatusMessage] = useState("");

    const generateContactNumber = () => {
        const numStr = "000000" + (Math.random() * 1000000 | 0);
        setContactNumber(numStr.substring(numStr.length - 6));
    }

    const { register, handleSubmit, watch } = useForm();
    const onSubmit = (data) => {
        const form = document.querySelector('#contact-form')
        const btn = document.querySelector('#send')
        const statusMessage = document.querySelector('.status-message');
        generateContactNumber();
        sendForm(process.env.REACT_APP_SERVICEID, process.env.REACT_APP_TEMP, '#contact-form')
            .then(function (res) {
                form.reset();
                btn.setAttribute('disabled', 'true')
                setStatusMessage("Message envoyé!");
                statusMessage.className = "status-message success";
                setTimeout(() => {
                    statusMessage.className = 'status-message'
                }, 5000);
            }, function (error) {
                setStatusMessage("Failed to send message! Please try again later.");
                statusMessage.className = "status-message failure";
                setTimeout(() => {
                    statusMessage.className = 'status-message'
                }, 5000)
            });
    }
    const message = watch('message') || "";
    const messageCharsLeft = 1500 - message.length;

    return (
        <>
            <Helmet>
                <title>Contact</title>
                <meta name="title" content="Contactez Mak'o! Nous répondons à tous vos problèmes" />
                <meta name="description"
                    content="Contactez Mak'o! Nous répondons à tous vos problèmes dans les plus brefs délais" />
            </Helmet>
            <Nav />
            <div className="titlePages">
                <h2>Nous contacter</h2>
            </div>
            <div id="contact" className="bg-light">
                <form id="contact-form" className=" mt-5 mb-5 form-control border-0" onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" name="contact_number" className="form-control" value={contactNumber} />
                    <label className="form-label">Sujet</label>
                    <input type="text" name="subject" className="form-control" />
                    <label className="form-label">Prénom</label>
                    <input type="text" name="user_name" className="form-control" />
                    <label className="form-label">Email</label>
                    <input type="email" name="user_email" className="form-control" />
                    <label className="form-label">Message</label>
                    <textarea name="message" maxLength='1500' rows="5"
                        className="form-control" {...register('message', { required: 'Required' })}></textarea>
                    <p className='message-chars-left'>{messageCharsLeft}</p>
                    <input className="btn btn-success form-control" type="submit" value="Send" id="send" />
                    <p className='status-message'>{statusMessage}</p>
                </form>
            </div>
            <Footer />
        </>

    )
}

export default Contact;