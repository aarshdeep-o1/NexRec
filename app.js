/* 
   NexRec
   Interactive Logic System: Particle Background, Custom Charts,
   SQL Terminal Simulation, and Client-side AI Recommendation Engine
*/

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. Particle Canvas Background
    // ----------------------------------------------------
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    const maxParticles = 65;
    const connectionDistance = 110;
    
    const mouse = {
        x: null,
        y: null,
        radius: 130
    };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 2 + 1.2;
            this.color = Math.random() > 0.5 ? "#00f0ff" : "#bf00ff";
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap-around
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction (push away slightly)
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for lines
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Canvas Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update & Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    let alpha = (1 - dist / connectionDistance) * 0.16;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();


    // ----------------------------------------------------
    // 2. Local Product Database & Recommender Engine (TF-IDF Simulation)
    // ----------------------------------------------------
    const productsData = [
        { id: 1, name: "Holo-Visor V2.0", category: "Wearables", description: "Holographic projection heads-up display with neon overlays and ambient mood analysis.", price: 249.99, rating: 4.8, tags: ["hologram", "wearable", "display", "neon", "hud", "cybergoggles"] },
        { id: 2, name: "Neon Grid Cyber-Jacket", category: "Wearables", description: "Luminous smart jacket reacting to baseline audio frequencies and ambient temperature. Weatherproof.", price: 399.99, rating: 4.6, tags: ["wearable", "fashion", "neon", "led", "clothing", "futuristic"] },
        { id: 3, name: "Apex Neural Jet-Sneakers", category: "Wearables", description: "Micro-thruster power sneakers with gravity dampening soles and carbon fiber casing.", price: 599.99, rating: 4.9, tags: ["shoes", "sneakers", "thrusters", "wearable", "gravity", "hypertech"] },
        { id: 4, name: "Chrono-Sync Smart-Glove", category: "Wearables", description: "Tactile feedback haptic glove featuring 12-channel physical mapping and smart lock bypass.", price: 189.50, rating: 4.3, tags: ["wearable", "glove", "haptic", "smart", "interface", "hacking"] },
        
        { id: 5, name: "Synapse-Link Core 1", category: "Neural Tech", description: "Direct cortical neural-link bypass. Accelerates dream recording and cognitive recall.", price: 899.00, rating: 4.7, tags: ["neural", "implant", "biotech", "brain", "memory", "upgrade"] },
        { id: 6, name: "DreamWeaver Slumber-Pod", category: "Neural Tech", description: "Sleep pod equipped with beta-wave synchronization and deep REM visualization.", price: 2450.00, rating: 4.9, tags: ["pod", "sleep", "dreams", "neural", "biometric", "relaxation"] },
        { id: 7, name: "Omni-Sight Cyber-Eye", category: "Neural Tech", description: "Ocular replacement kit offering infrared, night-vision, and digital zoom. Surgical install required.", price: 1350.00, rating: 4.5, tags: ["implant", "ocular", "sight", "biotech", "vision", "camera"] },
        { id: 8, name: "Bio-Pulse Stimpack XL", category: "Neural Tech", description: "Regenerative adrenaline gel that accelerates local cell repair and cellular recovery.", price: 45.00, rating: 4.2, tags: ["stimpack", "biotech", "health", "energy", "boost", "quickheal"] },
        
        { id: 9, name: "Qubit-X Core Processor", category: "Quantum Computing", description: "1000-qubit desktop room-temperature quantum processor with dark matter coolant.", price: 1200.00, rating: 4.9, tags: ["quantum", "cpu", "hardware", "core", "supercomputer", "speed"] },
        { id: 10, name: "Void-Shield SSD (2TB)", category: "Quantum Computing", description: "Quantum-encrypted temporal flash drive with instantaneous speed and sub-space backup.", price: 299.99, rating: 4.7, tags: ["storage", "ssd", "harddrive", "quantum", "encryption", "sub-space"] },
        { id: 11, name: "Neon-Core Liquid Cooler", category: "Quantum Computing", description: "Glow-in-the-dark electromagnetic cooling unit with self-purifying nanobots.", price: 159.00, rating: 4.4, tags: ["cooler", "hardware", "cooling", "rgb", "liquid", "nanobots"] },
        { id: 12, name: "Temporal Memory Block", category: "Quantum Computing", description: "128GB super-position volatile cache allowing instantaneous reload of previous states.", price: 450.00, rating: 4.8, tags: ["ram", "cache", "memory", "quantum", "speed", "multi-tasking"] },
        
        { id: 13, name: "Nano-Energy Brew (Blue-Razz)", category: "Consumables", description: "Hyper-caffeinated synthetic recovery beverage with glowing electrolytic nano-pods.", price: 4.99, rating: 4.1, tags: ["drink", "beverage", "caffeine", "energy", "blue", "synthfood"] },
        { id: 14, name: "Glitch Ramen (Spice Core)", category: "Consumables", description: "Dehydrated synthetic noodle block infused with high-frequency flavor compounds.", price: 8.50, rating: 4.3, tags: ["food", "ramen", "synthetic", "spice", "synthfood", "instant"] },
        { id: 15, name: "Cortex Stim-Mint", category: "Consumables", description: "Nootropic brain-boost mints for prolonged mental clarity and coding speed.", price: 12.00, rating: 4.5, tags: ["mints", "candy", "focus", "nootropics", "brain", "coding"] },
        { id: 16, name: "Plasma Fuel Brew", category: "Consumables", description: "Carbonated thermal beverage delivering thermal cellular energy and instant focus.", price: 5.50, rating: 4.4, tags: ["drink", "energy", "plasma", "focus", "synthfood", "carbonated"] }
    ];

    // Compute Cosine Similarity dynamically based on Tags and Descriptions
    function getRecommendations(seedId, count = 3) {
        const seedProduct = productsData.find(p => p.id === parseInt(seedId));
        if (!seedProduct) return [];

        const results = [];
        
        // Tokenize a helper text block (name + description + tags)
        const getTokens = (p) => {
            const text = (p.name + " " + p.description + " " + p.tags.join(" ")).toLowerCase();
            return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
        };

        const seedTokens = getTokens(seedProduct);

        productsData.forEach(prod => {
            if (prod.id === seedProduct.id) return; // Skip seed item itself

            const prodTokens = getTokens(prod);
            
            // Build term frequency vectors
            const allTerms = Array.from(new Set([...seedTokens, ...prodTokens]));
            const vecSeed = allTerms.map(t => seedTokens.filter(x => x === t).length);
            const vecProd = allTerms.map(t => prodTokens.filter(x => x === t).length);

            // Compute dot product
            let dotProduct = 0;
            let magSeed = 0;
            let magProd = 0;
            for (let i = 0; i < allTerms.length; i++) {
                dotProduct += vecSeed[i] * vecProd[i];
                magSeed += vecSeed[i] * vecSeed[i];
                magProd += vecProd[i] * vecProd[i];
            }

            const magnitude = Math.sqrt(magSeed) * Math.sqrt(magProd);
            const similarity = magnitude > 0 ? (dotProduct / magnitude) : 0;

            results.push({
                product: prod,
                similarity: similarity
            });
        });

        // Sort by similarity descending
        results.sort((a, b) => b.similarity - a.similarity);
        return results.slice(0, count);
    }

    // Populate recommendation select options
    const recSelect = document.getElementById("seed-product-select");
    productsData.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = `${p.name} [${p.category}]`;
        recSelect.appendChild(opt);
    });

    // Populate UI recommendation cards
    const recsGrid = document.getElementById("recommendations-grid");
    const recommendBtn = document.getElementById("trigger-recommend-btn");

    function renderRecommendations(seedId) {
        recsGrid.innerHTML = ""; // Clear
        const recList = getRecommendations(seedId, 3);

        recList.forEach(item => {
            const card = document.createElement("div");
            card.className = "glass-card product-card";
            
            const similarityPercentage = Math.round(item.similarity * 100);
            
            card.innerHTML = `
                <div class="match-badge">${similarityPercentage}% Match</div>
                <div>
                    <div class="prod-category">${item.product.category}</div>
                    <div class="prod-title">${item.product.name}</div>
                    <div class="prod-description">${item.product.description}</div>
                </div>
                <div class="prod-footer">
                    <div class="prod-price">$${item.product.price.toFixed(2)}</div>
                    <div class="prod-rating">★ ${item.product.rating.toFixed(1)}</div>
                </div>
            `;
            recsGrid.appendChild(card);
        });
    }

    // Initial render & Action Listener
    renderRecommendations(recSelect.value);
    
    recommendBtn.addEventListener("click", () => {
        recommendBtn.classList.add("cyber-btn-active");
        recommendBtn.innerText = "Analyzing Neural Vectors...";
        
        setTimeout(() => {
            renderRecommendations(recSelect.value);
            recommendBtn.classList.remove("cyber-btn-active");
            recommendBtn.innerText = "Compute AI Cosine Matches";
        }, 600);
    });


    // ----------------------------------------------------
    // 3. Dynamic Visual Charts Rendering (Chart.js Integration)
    // ----------------------------------------------------
    Chart.defaults.color = '#9e94cb';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.font.size = 11;

    // Helper to generate glowing gradient fills
    function getNeonGradient(ctx, colorStart, colorEnd) {
        const grad = ctx.createLinearGradient(0, 0, 0, 200);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(1, colorEnd);
        return grad;
    }

    // Chart 1: Sales Trend (Monthly Line Chart)
    const salesCtx = document.getElementById('sales-trend-chart').getContext('2d');
    const salesGrad = getNeonGradient(salesCtx, 'rgba(0, 240, 255, 0.35)', 'rgba(191, 0, 255, 0.02)');
    
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [{
                label: 'Monthly Revenue ($)',
                data: [12000, 15400, 13100, 18600, 24500, 31000],
                borderColor: '#00f0ff',
                borderWidth: 3,
                backgroundColor: salesGrad,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#bf00ff',
                pointBorderColor: '#fff',
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.03)' } }
            }
        }
    });

    // Chart 2: Customer Segments (Doughnut Chart)
    const segmentCtx = document.getElementById('segment-pie-chart').getContext('2d');
    new Chart(segmentCtx, {
        type: 'doughnut',
        data: {
            labels: ["Cyber-Runners", "Corpo-Executives", "Grid-Hackers", "Tech-Nomads"],
            datasets: [{
                data: [12, 9, 11, 6],
                backgroundColor: ['#00f0ff', '#bf00ff', '#ff007f', '#00ffc4'],
                borderColor: 'rgba(7, 5, 16, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 10, padding: 10, color: '#f1ecff' }
                }
            }
        }
    });

    // Chart 3: Top Products (Horizontal Bar Chart)
    const productsCtx = document.getElementById('top-products-chart').getContext('2d');
    const prodGrad = getNeonGradient(productsCtx, 'rgba(0, 240, 255, 0.75)', 'rgba(191, 0, 255, 0.75)');
    
    new Chart(productsCtx, {
        type: 'bar',
        data: {
            labels: ["Holo-Visor", "Cyber-Jacket", "Smart-Glove", "Memory-Block", "Synapse-Link"],
            datasets: [{
                data: [1240, 950, 730, 680, 540],
                backgroundColor: prodGrad,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.03)' } }
            }
        }
    });

    // Chart 4: Revenue by Location (Vertical Bar Chart)
    const locationCtx = document.getElementById('location-revenue-chart').getContext('2d');
    const locGrad = getNeonGradient(locationCtx, 'rgba(0, 255, 196, 0.8)', 'rgba(0, 240, 255, 0.2)');
    
    new Chart(locationCtx, {
        type: 'bar',
        data: {
            labels: ["Neo-Tokyo", "Aether-Spire", "Net-Zone", "Rust-Suburbs"],
            datasets: [{
                data: [48000, 32000, 18000, 16845.2],
                backgroundColor: locGrad,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.03)' } }
            }
        }
    });

    // Chart 5: Rating Distribution (Radar/Polar Chart)
    const ratingCtx = document.getElementById('rating-dist-chart').getContext('2d');
    new Chart(ratingCtx, {
        type: 'bar',
        data: {
            labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
            datasets: [{
                data: [82, 31, 14, 6, 2],
                backgroundColor: ['#00ffc4', '#00f0ff', '#ffb700', '#ff007f', '#420b12'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.03)' } }
            }
        }
    });

    // Chart 6: Cosine Similarity scores (Radar Chart)
    const cosineCtx = document.getElementById('cosine-sim-chart').getContext('2d');
    new Chart(cosineCtx, {
        type: 'radar',
        data: {
            labels: ["Wearables Similarity", "Neural Tech Overlap", "Hardware Correlation", "Customer Cohorts", "Trending Momentum"],
            datasets: [{
                label: 'Precision Weight',
                data: [0.85, 0.74, 0.92, 0.68, 0.81],
                borderColor: '#bf00ff',
                backgroundColor: 'rgba(191, 0, 255, 0.15)',
                borderWidth: 2,
                pointBackgroundColor: '#00f0ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                r: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { display: false }
                }
            }
        }
    });


    // ----------------------------------------------------
    // 4. Simulated SQL Interactive Terminal Console
    // ----------------------------------------------------
    const terminalBody = document.getElementById("terminal-body");
    const cmdItems = document.querySelectorAll(".terminal-cmd-item");

    const sqlAnswers = {
        products: `
<table class="terminal-output-table">
    <thead>
        <tr>
            <th>product_id</th>
            <th>name</th>
            <th>price</th>
            <th>rating</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>3</td><td>Apex Neural Jet-Sneakers</td><td>$599.99</td><td>4.9</td></tr>
        <tr><td>5</td><td>Synapse-Link Core 1</td><td>$899.00</td><td>4.7</td></tr>
        <tr><td>6</td><td>DreamWeaver Slumber-Pod</td><td>$2450.00</td><td>4.9</td></tr>
        <tr><td>7</td><td>Omni-Sight Cyber-Eye</td><td>$1350.00</td><td>4.5</td></tr>
        <tr><td>9</td><td>Qubit-X Core Processor</td><td>$1200.00</td><td>4.9</td></tr>
    </tbody>
</table>
<div style="color: #645b8e; font-size: 0.8rem; margin-top: 5px;">(5 rows returned • Exec: 0.041s)</div>
        `,
        customers: `
<table class="terminal-output-table">
    <thead>
        <tr>
            <th>segment</th>
            <th>user_count</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Cyber-Runners</td><td>12</td></tr>
        <tr><td>Corpo-Executives</td><td>9</td></tr>
        <tr><td>Grid-Hackers</td><td>11</td></tr>
        <tr><td>Tech-Nomads</td><td>6</td></tr>
        <tr><td>Neon-Casuals</td><td>2</td></tr>
    </tbody>
</table>
<div style="color: #645b8e; font-size: 0.8rem; margin-top: 5px;">(5 rows returned • Exec: 0.012s)</div>
        `,
        trending: `
<table class="terminal-output-table">
    <thead>
        <tr>
            <th>product_name</th>
            <th>total_sales</th>
            <th>units_ordered</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Holo-Visor V2.0</td><td>$309,987.60</td><td>1240</td></tr>
        <tr><td>Neon Grid Cyber-Jacket</td><td>$379,990.50</td><td>950</td></tr>
        <tr><td>Chrono-Sync Smart-Glove</td><td>$138,335.00</td><td>730</td></tr>
    </tbody>
</table>
<div style="color: #645b8e; font-size: 0.8rem; margin-top: 5px;">(3 rows returned • Exec: 0.076s)</div>
        `
    };

    cmdItems.forEach(item => {
        item.addEventListener("click", () => {
            const queryText = item.dataset.query;
            const targetAnswer = item.dataset.target;
            
            // Print command syntax to terminal body
            terminalBody.innerHTML = `
                <div><span style="color: #bf00ff;">nexrec-root@ai-core:~$</span> <span style="color: #00f0ff;">sqlite3 nexrec.db</span></div>
                <div style="color:#f1ecff; font-weight: 500; font-family: monospace; word-wrap: break-word;">sqlite&gt; ${queryText}</div>
                <div style="color: #4af626; margin-top: 5px;">Executing cortical query in sqlite network...</div>
            `;
            
            // Auto scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;

            setTimeout(() => {
                terminalBody.innerHTML += `
                    <div style="margin-top: 10px;">${sqlAnswers[targetAnswer]}</div>
                    <div style="margin-top: 15px;"><span style="color: #bf00ff;">nexrec-root@ai-core:~$</span> <span class="blink-cursor">_</span></div>
                `;
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 750);
        });
    });


    // ----------------------------------------------------
    // 5. Tech Stack Card Code Toggler
    // ----------------------------------------------------
    const techCards = document.querySelectorAll(".tech-card");
    const codePreviewTitle = document.getElementById("code-title");
    const codePreviewBlock = document.getElementById("code-block-element");

    const techCodeSnippets = {
        python: `import pandas as pd
import sqlite3

def clean_sales_records(db_path="nexrec.db"):
    # Connect to local SQLite analytics db
    conn = sqlite3.connect(db_path)
    
    # Extract transaction logs for model processing
    df = pd.read_sql_query("""
        SELECT transaction_id, customer_id, product_id, amount, timestamp 
        FROM transactions
    """, conn)
    
    # Process outliers and format dates
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['revenue_clean'] = df['amount'].clip(lower=0)
    
    conn.close()
    return df`,
        sql: `/* Find high-value active customer segments */
SELECT 
    c.segment, 
    COUNT(DISTINCT c.customer_id) AS total_users,
    SUM(t.amount) AS total_segment_sales,
    ROUND(AVG(t.amount), 2) AS avg_basket_size
FROM customers c
JOIN transactions t ON c.customer_id = t.customer_id
WHERE t.timestamp >= DATE('now', '-30 days')
GROUP BY c.segment
ORDER BY total_segment_sales DESC;`,
        streamlit: `import streamlit as st
import recommender

# Set glassmorphic theme styling
st.title("🌌 NexRec Engine")

selected = st.selectbox("Pick Target Core", ["Holo-Visor", "Jet-Sneakers"])
if st.button("Generate Recommendations"):
    results = recommender.get_content_recommendations(selected)
    for res in results:
        st.metric(label=res['name'], value=f"\${res['price']}", delta=f"{res['similarity']*100}% Match")`,
        scikit: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_cosine_similarity(df):
    # Combine category description and tags for vector matching
    features = df['category'] + " " + df['description'] + " " + df['tags']
    
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(features)
    
    # Compute Cosine similarity matrix
    similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
    return similarity_matrix`
    };

    techCards.forEach(card => {
        card.addEventListener("click", () => {
            const techKey = card.dataset.tech;
            
            // Set header label
            codePreviewTitle.innerText = `${techKey.toUpperCase()} PIPELINE INTERACTION`;
            
            // Write snippet
            codePreviewBlock.textContent = techCodeSnippets[techKey];
            
            // Add subtle active highlighting style
            techCards.forEach(c => c.style.borderColor = "rgba(255, 255, 255, 0.08)");
            card.style.borderColor = techKey === "python" || techKey === "streamlit" ? "var(--neon-blue)" : "var(--neon-purple)";
        });
    });

    // ----------------------------------------------------
    // 6. Light / Dark Theme Switching Logic
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    
    // Check localStorage preference on startup
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun glow-text-blue"></i> <span id="theme-label" style="margin-left: 5px;">Light Mode</span>`;
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isLight = document.body.classList.toggle("light-theme");
            
            if (isLight) {
                themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun glow-text-blue"></i> <span id="theme-label" style="margin-left: 5px;">Light Mode</span>`;
                localStorage.setItem("theme", "light");
            } else {
                themeToggleBtn.innerHTML = `<i class="fa-solid fa-moon glow-text-purple"></i> <span id="theme-label" style="margin-left: 5px;">Dark Mode</span>`;
                localStorage.setItem("theme", "dark");
            }
        });
    }

    // ----------------------------------------------------
    // 7. Trained AI Chatbot Interaction Logic
    // ----------------------------------------------------
    const chatbotToggleBtn = document.getElementById("chatbot-toggle-btn");
    const chatWindow = document.getElementById("chat-window");
    const chatCloseBtn = document.getElementById("chat-close-btn");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");
    const suggestBtns = document.querySelectorAll(".chat-suggest-btn");

    if (chatbotToggleBtn && chatWindow) {
        // Bulletproof opening/closing with transitions and display styling
        chatbotToggleBtn.addEventListener("click", () => {
            const isHidden = chatWindow.style.display === "none" || chatWindow.style.display === "";
            if (isHidden) {
                chatWindow.style.setProperty("display", "flex", "important");
                setTimeout(() => {
                    chatWindow.classList.add("chat-active");
                }, 10);
            } else {
                chatWindow.classList.remove("chat-active");
                setTimeout(() => {
                    chatWindow.style.setProperty("display", "none", "important");
                }, 350);
            }
        });

        // Close Chat Window
        if (chatCloseBtn) {
            chatCloseBtn.addEventListener("click", () => {
                chatWindow.classList.remove("chat-active");
                setTimeout(() => {
                    chatWindow.style.setProperty("display", "none", "important");
                }, 350);
            });
        }

        // Add Quick Suggestion clicks
        suggestBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const msg = btn.dataset.msg;
                chatInput.value = msg;
                sendChatMessage();
            });
        });

        // Add Send on Enter keypress
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                sendChatMessage();
            }
        });

        // Send Click Listener
        if (chatSendBtn) {
            chatSendBtn.addEventListener("click", sendChatMessage);
        }

        function appendMessage(text, isUser = false) {
            const msgDiv = document.createElement("div");
            if (isUser) {
                msgDiv.style.alignSelf = "flex-end";
                msgDiv.style.background = "rgba(0, 240, 255, 0.15)";
                msgDiv.style.border = "1px solid var(--neon-blue)";
                msgDiv.style.borderRadius = "12px 12px 0px 12px";
                msgDiv.style.padding = "10px 14px";
                msgDiv.style.maxWidth = "85%";
                msgDiv.style.color = "var(--text-primary)";
                msgDiv.style.lineHeight = "1.4";
            } else {
                msgDiv.style.alignSelf = "flex-start";
                msgDiv.style.background = "rgba(255, 255, 255, 0.04)";
                msgDiv.style.border = "1px solid var(--border-glass)";
                msgDiv.style.borderRadius = "12px 12px 12px 0px";
                msgDiv.style.padding = "10px 14px";
                msgDiv.style.maxWidth = "85%";
                msgDiv.style.color = "var(--text-primary)";
                msgDiv.style.lineHeight = "1.4";
            }
            msgDiv.innerHTML = text;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Dynamic 3-4 Quick Reply Chips Appender
        function appendChips() {
            // Remove existing dynamic container if present
            const oldChips = document.querySelector(".dynamic-chips-container");
            if (oldChips) oldChips.remove();

            const chipsDiv = document.createElement("div");
            chipsDiv.className = "dynamic-chips-container";
            chipsDiv.style.display = "flex";
            chipsDiv.style.flexWrap = "wrap";
            chipsDiv.style.gap = "6px";
            chipsDiv.style.marginTop = "5px";
            chipsDiv.style.marginBottom = "5px";
            chipsDiv.style.alignSelf = "flex-start";

            const suggestions = [
                { text: "🕶️ Recommend", msg: "recommend" },
                { text: "🔥 Trending", msg: "trending" },
                { text: "👥 Segments", msg: "segment" },
                { text: "⚡ Revenue", msg: "revenue" }
            ];

            suggestions.forEach(item => {
                const btn = document.createElement("button");
                btn.className = "chat-suggest-btn";
                btn.style.background = "rgba(191, 0, 255, 0.08)";
                btn.style.border = "1px solid rgba(191, 0, 255, 0.2)";
                btn.style.borderRadius = "20px";
                btn.style.color = "var(--neon-purple)";
                btn.style.padding = "4px 10px";
                btn.style.fontSize = "0.72rem";
                btn.style.cursor = "pointer";
                btn.style.transition = "var(--transition-smooth)";
                btn.style.fontFamily = "var(--font-heading)";
                btn.innerText = item.text;
                
                btn.addEventListener("click", () => {
                    chatInput.value = item.msg;
                    sendChatMessage();
                });
                chipsDiv.appendChild(btn);
            });

            chatMessages.appendChild(chipsDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function sendChatMessage() {
            const query = chatInput.value.trim();
            if (!query) return;

            // Remove any dynamic chips currently visible
            const oldChips = document.querySelector(".dynamic-chips-container");
            if (oldChips) oldChips.remove();

            // Append User message
            appendMessage(query, true);
            chatInput.value = "";

            // Show Typing indicator with bouncing dots
            const typingDiv = document.createElement("div");
            typingDiv.id = "chat-typing-indicator";
            typingDiv.style.alignSelf = "flex-start";
            typingDiv.style.marginTop = "5px";
            typingDiv.innerHTML = `
                <div class="typing-dots" style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-glass); border-radius: 12px 12px 12px 0px; padding: 10px 14px;">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                // Remove typing indicator
                const indicator = document.getElementById("chat-typing-indicator");
                if (indicator) indicator.remove();

                const qLower = query.toLowerCase();
                let responseText = "";

                // Precise keyword-intent detection mappings
                if (qLower.includes("recommend") || qLower.includes("product")) {
                    responseText = "Vector match complete. Based on tag metrics, I highly recommend checking out **Holo-Visor V2.0** ($249.99, 4.8★) or the audio-reactive **Neon Grid Cyber-Jacket** ($399.99). Try our AI playground for a detailed cosine similarity weight!";
                } else if (qLower.includes("trending")) {
                    responseText = "Reading sales velocity logs. The top trending products in NexRec are:<br>1. **Holo-Visor V2.0** (1240 orders)<br>2. **Neon Grid Cyber-Jacket** (950 orders)<br>3. **Chrono-Sync Smart-Glove** (730 orders).";
                } else if (qLower.includes("segment") || qLower.includes("customer")) {
                    responseText = "Demographics mapped in SQLite:<br>• **Cyber-Runners**: Street couriers and hackers (12 users)<br>• **Corpo-Executives**: Elite high-credits profiles (9 users)<br>• **Grid-Hackers**: Net-security specialists (11 users)<br>• **Tech-Nomads**: Mobile solar wanderers (6 users).";
                } else if (qLower.includes("sales") || qLower.includes("revenue")) {
                    responseText = "Financial telemetry logs summary:<br>• **Total Sales**: $114,845.20<br>• **Active Demographic Nodes**: 40 users<br>• **Click-Through Rate (CTR)**: 14.8%<br>• **Top Region**: Neo-Tokyo ($48,000.00).";
                } else if (qLower.includes("help")) {
                    responseText = "I am trained to answer your queries about:<br>🕶️ **recommend** (content tag similarity)<br>🔥 **trending** (sales velocity lists)<br>👥 **segment** (cohort demographics)<br>⚡ **sales** / **revenue** (financial logs check)<br>❓ **help** (queries checklist)<br>👋 **hi** / **hello** (greetings)";
                } else if (qLower.includes("hi") || qLower.includes("hello")) {
                    responseText = "Greetings, traveler! I am the NexRec **Neural Advisor** chatbot. I can analyze and return smart data about wearables, top-sellers, customer segments, or sales insights!";
                } else {
                    responseText = "Query successfully parsed by scikit-learn NLU core. I recommend trying out our **AI Product Recommendation Playground** in the dashboard to check similarities, or running a custom query on our **SQL Sandbox terminal**!";
                }

                appendMessage(responseText, false);
                appendChips(); // Append reply chips dynamically
            }, 800);
        }

        // Render initial suggested reply chips
        appendChips();
    }
});
