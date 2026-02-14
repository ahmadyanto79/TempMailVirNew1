const API_KEY = 'ef66e4fffbmshc4ad32b653ea502p1c9116jsnef1759373801';
const API_HOST = 'temp-mail-org4.p.rapidapi.com';
const BASE_URL = `https://${API_HOST}`;

let currentEmail = "";

// Fungsi Ganti Tab
function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
}

// Fungsi Buat Email Baru
async function generateEmail() {
    const display = document.getElementById('email-text');
    display.innerText = "Membuat...";
    
    try {
        const res = await fetch(`${BASE_URL}/generate`, {
            headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
        });
        const data = await res.json();
        
        // Logika agar tidak undefined
        currentEmail = data.email || (Array.isArray(data) ? data[0] : (typeof data === 'string' ? data : "Gagal"));
        
        display.innerText = currentEmail;
        
        // Reset tampilan inbox
        document.getElementById('unread-messages-list').innerHTML = `
            <div class="empty-state">
                <span class="empty-icon"></span>
                <p>Menunggu pesan masuk...</p>
            </div>`;
    } catch (e) {
        display.innerText = "Error API";
    }
}

// Fungsi Cek Pesan Masuk
async function checkInbox() {
    if (!currentEmail || currentEmail.includes("...")) return;
    
    try {
        const res = await fetch(`${BASE_URL}/mailbox/${currentEmail}`, {
            headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
        });
        const messages = await res.json();

        if (Array.isArray(messages) && messages.length > 0) {
            const container = document.getElementById('unread-messages-list');
            container.innerHTML = "";
            
            messages.forEach(msg => {
                const card = document.createElement('div');
                card.className = 'email-box-card';
                card.style.textAlign = "left";
                card.style.borderLeft = "4px solid #007AFF";
                card.style.cursor = "pointer";
                card.innerHTML = `
                    <strong>${msg.from}</strong><br>
                    <span style="font-size:13px">${msg.subject}</span>
                `;
                card.onclick = () => alert(`Dari: ${msg.from}\nSubjek: ${msg.subject}\n\nIsi:\n${msg.body_text || msg.body}`);
                container.appendChild(card);
            });
        }
    } catch (e) { console.log("Cek email..."); }
}

function copyEmail() {
    const txt = document.getElementById('email-text').innerText;
    if(txt.includes("@")) {
        navigator.clipboard.writeText(txt);
        alert("Email disalin!");
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    generateEmail();
    setInterval(checkInbox, 5000); // Cek otomatis tiap 5 detik
});
