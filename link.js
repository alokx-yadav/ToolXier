document.addEventListener('DOMContentLoaded', () => {
    const backendURL = "https://link.toolxier.xyz"; // Change to your backend URL when deployed   https://linkxier.onrender.com/     https://link.toolxier.xyz


	
	fetch("https://link.toolxier.xyz") 
  .then(res => res.json())
  .then(data => console.log(data));


    // --- DOM Element References ---
    const shortenBtn = document.getElementById("shortenBtn");
    const pasteIcon = document.getElementById("pasteIcon");
    const sortBtn = document.getElementById("sortBtn");
    const resetBtn = document.getElementById("resetBtn");
    const longUrlInput = document.getElementById("longUrl");
    const customCodeInput = document.getElementById("customCode");
    const resultDiv = document.getElementById("result");
    const lastLinksDiv = document.getElementById("lastLinks");
    const sortedLinksDiv = document.getElementById("sortedLinks");
    const lastLinksContainer = document.getElementById("lastLinksContainer");
    const sortedLinksContainer = document.getElementById("sortedLinksContainer");

    // --- State ---
    let lastLinks = JSON.parse(localStorage.getItem("lastLinks") || "[]");

    // --- Functions ---
    const createCardHTML = (link) => {
        return `
            <div class="link-card">
                <div class="link-text">
                    <a href="${link}" target="_blank">${link.replace(/^https?:\/\//, '')}</a>
                </div>
                <div class="link-spacer"></div>
                <div class="card-actions">
                    <button onclick="copyLink('${link}')" title="Copy Link"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                    <button onclick="shareLink('${link}')" title="Share Link"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></button>
                </div>
            </div>`;
    };

    const renderLinks = (links, container) => {
        container.innerHTML = "";
        const associatedContainer = container.id === 'lastLinks' ? lastLinksContainer : sortedLinksContainer;
        if (links.length === 0) {
            associatedContainer.style.display = 'none';
            return;
        }
        associatedContainer.style.display = 'block';
        links.forEach(link => {
            container.insertAdjacentHTML('beforeend', createCardHTML(link));
        });
    };

    const shortenUrl = async () => {
        const longUrl = longUrlInput.value.trim();
        const customCode = customCodeInput.value.trim();
        if (!longUrl) { alert("Please enter a URL to shorten."); return; }
        
        resultDiv.innerHTML = `<div class="result-content" style="color: var(--text-primary-on-light);">⏳ Shortening...</div>`;
        resultDiv.className = 'result show';

        try {
            const response = await fetch(`${backendURL}/shorten`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ longurl: longUrl, customCode }) });
            const data = await response.json();

            if (data.error) {
                resultDiv.innerHTML = `<div class="result-content" style="color: var(--danger-color);">❌ Error: ${data.error}</div>`;
                return;
            }

            resultDiv.innerHTML = createCardHTML(data.short).replace('link-card', 'result-content');

            if (!lastLinks.includes(data.short)) {
                lastLinks.unshift(data.short);
                if (lastLinks.length > 5) lastLinks.pop();
                localStorage.setItem("lastLinks", JSON.stringify(lastLinks));
                renderLinks(lastLinks, lastLinksDiv);
            }
        } catch (err) {
            resultDiv.innerHTML = `<div class="result-content" style="color: var(--danger-color);">⚠️ Failed to connect to backend.</div>`;
            console.error(err);
        }
    };

    const resetLinks = () => {
        if (lastLinks.length === 0) return;
        if (confirm("Are you sure you want to clear all recent links?")) {
            lastLinks = [];
            localStorage.removeItem("lastLinks");
            renderLinks([], lastLinksDiv);
            renderLinks([], sortedLinksDiv);
        }
    };
    
    // --- Event Listeners ---
    shortenBtn.addEventListener("click", shortenUrl);
    resetBtn.addEventListener("click", resetLinks);
    pasteIcon.addEventListener("click", async () => {
        try {
            const text = await navigator.clipboard.readText();
            longUrlInput.value = text;
            longUrlInput.focus();
        } catch (err) { alert('Failed to read clipboard contents.'); }
    });
    sortBtn.addEventListener("click", () => {
        if (lastLinks.length > 0) {
            const sorted = [...lastLinks].sort();
            renderLinks(sorted, sortedLinksDiv);
        } else {
             sortedLinksContainer.style.display = 'none';
        }
    });

    // --- Global Functions ---
    window.copyLink = (link) => { navigator.clipboard.writeText(link).then(() => alert("✅ Link copied to clipboard!")); };
    window.shareLink = (link) => {
        if (navigator.share) {
            navigator.share({ title: "Check out this shortened link!", url: link }).catch(console.error);
        } else {
            copyLink(link);
            alert("Sharing not supported, link copied instead!");
        }
    };
    
    // --- Initial Load ---
    renderLinks(lastLinks, lastLinksDiv);


	    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    // Close menu when any link clicked
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
        });
    });



	


});





