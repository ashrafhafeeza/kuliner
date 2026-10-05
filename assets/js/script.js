// JavaScript ini mengatur slider foto dan pop-up resep pada halaman.

// Cari area slider. Pemeriksaan ini mencegah error jika elemen slider tidak ada.
const slider = document.querySelector("#slider");

if (slider) {
    // Simpan elemen-elemen slider agar bisa digunakan kembali tanpa mencarinya berulang kali.
    const slides = Array.from(slider.querySelectorAll(".slide"));
    const dotsContainer = document.querySelector(".slider-dots");
    const currentIndex = document.querySelector("#currentIndex");
    const previousButton = slider.querySelector(".prev");
    const nextButton = slider.querySelector(".next");
    // activeIndex menyimpan nomor foto aktif (mulai dari 0), timer menyimpan jadwal ganti otomatis.
    let activeIndex = 0;
    let autoSlideTimer;

    // Buat satu tombol titik untuk setiap foto agar pengunjung bisa memilih foto langsung.
    const dots = slides.map((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Tampilkan foto ${index + 1}`);
        // Saat titik ditekan, tampilkan foto dengan nomor yang sama.
        dot.addEventListener("click", () => showSlide(index));
        dotsContainer.append(dot);
        return dot;
    });

    // Menampilkan foto berdasarkan nomor indeks, lalu memperbarui penanda aktifnya.
    function showSlide(index) {
        // Operator modulo membuat navigasi berputar dari foto terakhir ke pertama, dan sebaliknya.
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle("active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
            dots[slideIndex].setAttribute("aria-current", String(isActive));
        });

        currentIndex.textContent = String(activeIndex + 1);
    }

    // Mengatur ulang timer agar foto berganti otomatis setiap lima detik.
    function resetAutoSlide() {
        window.clearInterval(autoSlideTimer);
        autoSlideTimer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    }

    // Tombol panah kiri/kanan pada slider menampilkan foto sebelum atau sesudahnya.
    previousButton.addEventListener("click", () => {
        showSlide(activeIndex - 1);
        resetAutoSlide();
    });

    nextButton.addEventListener("click", () => {
        showSlide(activeIndex + 1);
        resetAutoSlide();
    });

    // Hentikan pergantian otomatis saat pengunjung mengarahkan mouse atau fokus ke slider.
    // Timer dijalankan kembali saat mouse atau fokus meninggalkan slider.
    slider.addEventListener("mouseenter", () => window.clearInterval(autoSlideTimer));
    slider.addEventListener("mouseleave", resetAutoSlide);
    slider.addEventListener("focusin", () => window.clearInterval(autoSlideTimer));
    slider.addEventListener("focusout", resetAutoSlide);
    // Izinkan navigasi slider menggunakan tombol panah di keyboard.
    slider.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showSlide(activeIndex - 1);
            resetAutoSlide();
        } else if (event.key === "ArrowRight") {
            showSlide(activeIndex + 1);
            resetAutoSlide();
        }
    });

    // Tampilkan foto pertama saat halaman dibuka, lalu mulai timer otomatis.
    showSlide(0);
    resetAutoSlide();
}

// Dialog resep hanya diatur jika elemen pop-up tersedia di halaman.
const recipeDialog = document.querySelector(".recipe-dialog");

if (recipeDialog) {
    // Data setiap resep. Nomor data-recipe pada kartu mengacu ke urutan resep di daftar ini,
    // dimulai dari indeks 0 (misalnya data-recipe="0" adalah Grontol).
    // Setiap objek menyimpan nama, daerah asal, bahan, dan langkah pembuatan satu makanan.
    const recipes = [
        {
            name: "Grontol",
            origin: "Betawi",
            description: "Jagung pipil hangat dengan kelapa parut yang gurih.",
            ingredients: ["Jagung pipil", "Kelapa parut", "Garam"],
            steps: ["Rebus atau kukus jagung hingga empuk, lalu tiriskan.", "Kukus kelapa parut dengan sedikit garam.", "Sajikan jagung dengan taburan kelapa."]
        },
        {
            name: "Clorot",
            origin: "Purworejo, Jawa Tengah",
            description: "Kue manis berbahan tepung beras yang dibungkus janur.",
            ingredients: ["Tepung beras", "Gula merah", "Santan", "Daun janur"],
            steps: ["Larutkan gula merah dalam santan hangat, lalu dinginkan.", "Tuang perlahan ke tepung beras sambil diaduk hingga licin.", "Isi selongsong janur dan kukus sampai adonan matang."]
        },
        {
            name: "Dodongkal",
            origin: "Jawa Barat",
            description: "Kue kukus berlapis kelapa dan gula merah yang legit.",
            ingredients: ["Tepung beras", "Kelapa parut", "Gula merah", "Garam"],
            steps: ["Campur tepung beras, kelapa parut, dan sedikit garam.", "Susun adonan dan irisan gula merah secara berlapis dalam kukusan.", "Kukus hingga matang, lalu sajikan selagi hangat."]
        },
        {
            name: "Lompong Sagu",
            origin: "Sumatera Barat",
            description: "Olahan sagu manis yang dibungkus daun pisang.",
            ingredients: ["Tepung sagu", "Pisang matang", "Kelapa parut", "Gula merah"],
            steps: ["Campur sagu, pisang yang dihaluskan, kelapa, dan gula merah.", "Bungkus adonan dengan daun pisang.", "Panggang atau kukus bungkusan hingga matang."]
        },
        {
            name: "Kue Rangi",
            origin: "Betawi, Jakarta",
            description: "Kue panggang dari sagu dan kelapa dengan saus gula merah.",
            ingredients: ["Tepung sagu", "Kelapa parut", "Garam", "Gula merah"],
            steps: ["Campur sagu, kelapa parut, dan sedikit garam.", "Panggang adonan dalam cetakan hingga bagian luarnya renyah.", "Masak gula merah dengan sedikit air hingga mengental, lalu siramkan."]
        },
        {
            name: "Sayur Babanci",
            origin: "Betawi, Jakarta",
            description: "Hidangan berkuah santan dan rempah khas Betawi.",
            ingredients: ["Daging sapi", "Santan", "Serai", "Lengkuas", "Bumbu halus"],
            steps: ["Rebus daging hingga empuk dan sisihkan kaldunya.", "Tumis bumbu halus bersama serai dan lengkuas hingga harum.", "Masukkan daging, kaldu, dan santan; masak sambil diaduk hingga kuah matang."]
        },
        {
            name: "Gulo Puan",
            origin: "Palembang, Sumatera Selatan",
            description: "Penganan manis khas Palembang yang secara tradisional dibuat dari susu kerbau.",
            ingredients: ["Susu kerbau", "Gula pasir"],
            steps: ["Campur susu dan gula dalam panci berdasar tebal.", "Masak dengan api kecil sambil terus diaduk.", "Angkat setelah mengental dan berubah kecokelatan, lalu dinginkan."]
        },
        {
            name: "Bassang",
            origin: "Makassar, Sulawesi Selatan",
            description: "Bubur jagung hangat yang lembut dan gurih-manis.",
            ingredients: ["Jagung kering", "Santan", "Gula", "Garam"],
            steps: ["Rendam jagung kering, lalu rebus hingga empuk.", "Tambahkan santan dan sedikit garam.", "Masak dengan api kecil sambil diaduk, lalu sajikan dengan gula."]
        },
        {
            name: "Mie Lethek",
            origin: "Bantul, DI Yogyakarta",
            description: "Mi tradisional berwarna kusam alami yang biasa dimasak dengan sayuran.",
            ingredients: ["Mie lethek", "Telur", "Kol atau sayuran", "Bawang", "Kecap"],
            steps: ["Rendam atau rebus mi hingga lunak, lalu tiriskan.", "Tumis bawang, masukkan telur dan sayuran.", "Tambahkan mi dan kecap, lalu aduk hingga matang."]
        },
        {
            name: "Kue Putu",
            origin: "Jawa",
            description: "Kue kukus berisi gula merah dengan taburan kelapa parut.",
            ingredients: ["Tepung beras", "Gula merah", "Kelapa parut", "Garam"],
            steps: ["Perciki tepung beras dengan air pandan, lalu ayak hingga berbutir.", "Isi cetakan dengan tepung dan gula merah tanpa memadatkannya.", "Kukus hingga matang dan sajikan dengan kelapa parut."]
        }
    ];
    const recipeTitle = recipeDialog.querySelector("#recipe-title");
    const recipeOrigin = recipeDialog.querySelector("#recipe-origin");
    const recipeDescription = recipeDialog.querySelector("#recipe-description");
    const recipeIngredients = recipeDialog.querySelector("#recipe-ingredients");
    const recipeSteps = recipeDialog.querySelector("#recipe-steps");

    // Pasang aksi pada setiap kartu: ambil data resep, lalu isi dan buka pop-up.
    document.querySelectorAll(".food-item").forEach((button) => {
        button.addEventListener("click", () => {
            // Ubah nomor resep dari teks atribut HTML menjadi angka untuk mengambil data yang sesuai.
            const recipe = recipes[Number(button.dataset.recipe)];

            // Jika nomor kartu tidak cocok dengan data resep, jangan mencoba membuka resep kosong.
            if (!recipe) {
                return;
            }

            // Isi judul dan keterangan resep. textContent menampilkan teks sebagai teks biasa.
            recipeTitle.textContent = recipe.name;
            recipeOrigin.textContent = `Asal daerah: ${recipe.origin}`;
            recipeDescription.textContent = recipe.description;
            // Buat elemen <li> baru untuk setiap bahan dan langkah, lalu ganti isi daftar lama.
            recipeIngredients.replaceChildren(...recipe.ingredients.map((ingredient) => {
                const item = document.createElement("li");
                item.textContent = ingredient;
                return item;
            }));
            recipeSteps.replaceChildren(...recipe.steps.map((step) => {
                const item = document.createElement("li");
                item.textContent = step;
                return item;
            }));
            // Buka dialog dengan API bawaan browser agar perilaku pop-up lebih mudah diakses.
            recipeDialog.showModal();
        });
    });

    // Tombol silang menutup dialog.
    recipeDialog.querySelector(".dialog-close").addEventListener("click", () => recipeDialog.close());
    // Klik pada area gelap di luar kotak resep juga menutup dialog.
    recipeDialog.addEventListener("click", (event) => {
        if (event.target === recipeDialog) {
            recipeDialog.close();
        }
    });
}

// Form feedback hanya berjalan pada halaman yang memiliki form dengan id "feedbackForm".
const feedbackForm = document.querySelector("#feedbackForm");

if (feedbackForm) {
    const feedbackList = document.querySelector("#feedbackList");
    const feedbackEmpty = document.querySelector("#feedbackEmpty");

    // Saat form dikirim, buat card dari data yang diisi pengunjung tanpa memuat ulang halaman.
    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(feedbackForm);
        const name = String(formData.get("nama")).trim();
        const food = String(formData.get("makanan")).trim();
        const categorySelect = feedbackForm.querySelector("#kategori");
        const category = categorySelect.selectedOptions[0].textContent.trim();
        const message = String(formData.get("pesan")).trim();

        // Siapkan card baru sebagai elemen HTML; isi pengunjung dipasang sebagai teks biasa.
        const card = document.createElement("article");
        card.className = "feedback-card";

        const cardCategory = document.createElement("p");
        cardCategory.className = "feedback-category";
        cardCategory.textContent = category;

        const cardTitle = document.createElement("h4");
        cardTitle.textContent = food;

        const cardMessage = document.createElement("p");
        cardMessage.className = "feedback-message";
        cardMessage.textContent = message;

        const cardAuthor = document.createElement("p");
        cardAuthor.className = "feedback-author";
        cardAuthor.textContent = `Dibagikan oleh ${name}`;

        // Tombol ini menghapus card yang dipilih dari halaman.
        const deleteButton = document.createElement("button");
        deleteButton.className = "feedback-delete";
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.setAttribute("aria-label", `Hapus cerita ${food} dari ${name}`);
        deleteButton.addEventListener("click", () => {
            card.remove();
            feedbackEmpty.hidden = feedbackList.children.length > 0;
        });

        card.append(cardCategory, cardTitle, cardMessage, cardAuthor, deleteButton);
        feedbackList.prepend(card);
        feedbackEmpty.hidden = true;
        feedbackForm.reset();
    });
}