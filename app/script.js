        let chats = [];
        let clientID = 1;

        function handleTagChange(tagSelect) {
            const additionalFields = tagSelect.closest('.chat-group').querySelector('.additional-fields');
            if (tagSelect.value === 'Ticket Advised' || tagSelect.value === 'Ticket Posted') {
                additionalFields.style.display = 'block';
            } else {
                additionalFields.style.display = 'none';
            }
        }

        function addChat() {
            const clientName = document.getElementById('client-name').value;
            const rating = document.getElementById('rating').value;
            const tag = document.getElementById('tag').value;
            const needed = document.getElementById('needed').value;
            const additionalInfo = document.getElementById('additional-info').value;

            if (clientName) {
                chats.push({ id: clientID++, clientName, rating, tag, needed, additionalInfo });
                updateOutput();
                updateClientTable();
                document.getElementById('client-name').value = '';
                document.getElementById('rating').value = 'None';
                document.getElementById('tag').value = 'Support Resolved';
                document.getElementById('needed').value = '';
                document.getElementById('additional-info').value = '';
                document.querySelector('.additional-fields').style.display = 'none';
            } else {
                alert('Please fill in the Client Name.');
            }
        }

function updateOutput() {
    const shift = document.getElementById('shift').value || '-';

    const totalChats = chats.length || '-';
    const goodRatings = chats.filter(chat => chat.rating === 'Good').length || '-';
    const badRatings = chats.filter(chat => chat.rating === 'Bad').length || '-';
    const reviewRequests = chats.filter(chat => chat.tag === 'Review Request').length || '-';

    const supportResolved = chats.filter(chat => chat.tag === 'Support Resolved').length || 0;
    const transferred = chats.filter(chat => chat.tag === 'Transferred').length || '-';
    const existingTickets = chats.filter(chat => chat.tag === 'Existing Ticket').length || '-';
    const billingTickets = chats.filter(chat => chat.tag === 'Billing Ticket').length || '-';

    const postedTickets = chats.filter(chat => chat.tag === 'Ticket Posted');
    const advisedTickets = chats.filter(chat => chat.tag === 'Ticket Advised');

    let report = `\n`;
    report += `——————————————-——————————————-———\n`;
    report += `Shift: ${shift}\n`;
    report += `——————————————-——————————————-———\n`;
    report += `* Total Chats: ${totalChats}\n`;
    report += `——————————————-——————————————-———\n`;
    report += `* Good Ratings: ${goodRatings}\n`;
    report += `* Bad Ratings: ${badRatings}\n`;
    report += `* Review Request: ${reviewRequests}\n`;
    report += `——————————————-——————————————-———\n`;
    report += `* Support Resolved: ${supportResolved}\n`;
    report += `——————————————-——————————————-———\n`;
    report += `* Transferred: ${transferred}\n`;
    report += `——————————————-——————————————-———\n`;
    report += `* Existing Ticket: ${existingTickets}\n`;
    report += `* Billing Ticket: ${billingTickets}\n`;
    report += `——————————————-——————————————-———\n`;
    report += `* Support Ticket Posted: ${postedTickets.length || 0}\n`;
    if (postedTickets.length > 0) {
        postedTickets.forEach((ticket, index) => {
            report += `${index + 1}.\n   - Link: ${ticket.additionalInfo || ''}\n   - Needed: ${ticket.needed || ''}\n`;
        });
    } else {
        report += `   - Link:\n   - Needed:\n`;
    }
    report += `——————————————-——————————————-———\n`;
    report += `* Support Ticket Advised: ${advisedTickets.length || 0}\n`;
    if (advisedTickets.length > 0) {
        advisedTickets.forEach((ticket, index) => {
            report += `${index + 1}\n   - Why: ${ticket.additionalInfo || ''}\n   - Needed: ${ticket.needed || ''}\n`;
        });
    } else {
        report += `   - Why:\n   - Needed:\n`;
    }
    report += `——————————————-——————————————-———\n`;

    document.getElementById('output').textContent = report;
}


      function updateClientTable() {
    const tableBody = document.getElementById('client-table-body');
    tableBody.innerHTML = '';
    chats.forEach(chat => {
        let row = `<tr>
            <td>${chat.id}</td>
            <td>${chat.clientName}</td>
            <td>${chat.tag}</td>
            <td>${chat.rating}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

        function copyToClipboard() {
            const output = document.getElementById('output').textContent;
            navigator.clipboard.writeText(output).then(() => {
                alert('Report copied to clipboard!');
            });
        }

function sendEmail() {
    const reportContent = document.getElementById('output').textContent; 

    const currentDate = new Date().toLocaleDateString('en-GB'); 
    const formattedDate = currentDate.split('/').reverse().join('.'); 
    
    const subject = `Daily Report - Daniel Dinev - ${formattedDate}`;

    console.log("Subject being sent:", subject); 
    console.log("Report being sent:", reportContent); 

    fetch('https://daniel-dinev.ampro1.fcomet.com/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: reportContent, subject: subject }), 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to send report. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert('Report sent successfully!');
        console.log('Success:', data); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while sending the report. Check the console for details.');
    });
}
