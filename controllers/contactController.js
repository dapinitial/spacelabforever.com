const { databaseId, messagesContainerId, cosmosClient, emailClient } = require('../utils/utils');
const database = cosmosClient.database(databaseId);

// Function to store contact details in Cosmos DB
const storeContactDetails = async (contactData) => {
    const container = cosmosClient.database(databaseId).container(messagesContainerId);
    const { resource: createdItem } = await container.items.create(contactData);
    return createdItem;
};

// Function to send an email
const sendEmail = async (emailMessage) => {
    try {
        const poller = await emailClient.beginSend(emailMessage); // Initiate the email send
        const emailResponse = await poller.pollUntilDone(); // Wait for the send to complete
        console.log('Email sent:', emailResponse);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const submitContactForm = async (req, res) => {
    try {
        const { name, email, website, message } = req.body;

        const geolocation = req.geolocation;
        const userAgent = req.userAgent;
        const screenWidth = req.screenWidth;
        const screenHeight = req.screenHeight;

        const contactData = {
            name,
            email,
            website,
            message,
            status: 'pending',
            geolocation,
            userAgent,
            screenSize: `Width: ${screenWidth}, Height: ${screenHeight} `,
        };

        // Store contact details in Cosmos DB
        const createdItem = await storeContactDetails(contactData);

        // Send email to recipient
        const recipientEmailMessage = {
            senderAddress: "donotreply@spacelabforever.com",
            displayName: "Spacelabforever👽",
            content: {
                subject: "New Contact Form Submission",
                plainText: `Name: ${name} \nEmail: ${email} \nWebsite: ${website} \nMessage: ${message} \n\nGeolocation: ${geolocation} \nUser Agent: ${userAgent} \nScreen Size: ${screenWidth}x${screenHeight} `,
            },
            recipients: {
                to: [
                    {
                        address: "2063979040@vtext.com",
                        displayName: "David Puerto",
                    }
                ],
            },
        };
        const isRecipientEmailSent = await sendEmail(recipientEmailMessage);

        // Send thank-you email to the person who submitted the form
        const thankYouEmailMessage = {
            senderAddress: "donotreply@spacelabforever.com",
            displayName: "Spacelabforever👽",
            content: {
                subject: "Thank You for Contacting Us",
                plainText: `Dear ${name}, \n\nThank you for contacting us! We have received your message and will get back to you as soon as possible.\n\nBest regards, \nThe Spacelabforever Primates`,
            },
            recipients: {
                to: [
                    {
                        address: email,
                        displayName: name,
                    }
                ],
            },
        };
        const isThankYouEmailSent = await sendEmail(thankYouEmailMessage);

        if (isRecipientEmailSent && isThankYouEmailSent) {
            res.status(200).json({ success: true, message: 'Contact form submitted' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send emails' });
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ success: false, message: 'Error submitting contact form' });
    }
};

module.exports = {
    submitContactForm
};
