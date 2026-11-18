/* =====================================================
   KONFIGURASI
===================================================== */

// Key untuk menyimpan data laporan
const STORAGE_KEY = "ereport_data_v4";

// Key untuk menyimpan tema
const THEME_KEY = "ereport_theme";


/* =====================================================
   DATA AWAL
===================================================== */

let laporan = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [
    {
        id: "LPR-01",
        tanggal: "10/11/2026",
        pelapor: "Muhammad Fairuz",
        kategori: "Internet",
        lokasi: "Gedung A",
        judul: "Kabel Internet Longgar",
        deskripsi:
            "Kabel internet longgar dan dapat membahayakan pengguna.",
        status: "Diproses"
    }
];


/* =====================================================
   HELPER
===================================================== */

const $ = (id) => document.getElementById(id);


/* =====================================================
   SIMPAN DATA
===================================================== */

function simpanData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(laporan)
    );
}


/* =====================================================
   NOTIFIKASI
===================================================== */

function tampilNotif(pesan, tipe = "success") {

    const box = $("notifBox");

    if (!box) return;

    box.textContent = pesan;

    box.className =
        "notification " + tipe;

    box.style.display = "block";

    setTimeout(() => {

        box.style.display = "none";

    }, 2500);
}


/* =====================================================
   STATUS BADGE
===================================================== */

function badgeStatus(status) {

    switch (status) {

        case "Menunggu":

            return `
                <span class="badge badge-menunggu">
                    Menunggu
                </span>
            `;

        case "Diproses":

            return `
                <span class="badge badge-diproses">
                    Diproses
                </span>
            `;

        case "Selesai":

            return `
                <span class="badge badge-selesai">
                    Selesai
                </span>
            `;

        default:

            return `
                <span class="badge">
                    Tidak diketahui
                </span>
            `;
    }
}


/* =====================================================
   RENDER DATA
===================================================== */

function renderData() {

    const search =
        $("searchBox").value.toLowerCase();

    const filter =
        $("statusFilter").value;


    // filter() digunakan untuk mencari data
    const data = laporan.filter(item => {

        const cocokSearch =
            item.judul.toLowerCase().includes(search) ||
            item.pelapor.toLowerCase().includes(search);

        const cocokStatus =
            filter === "Semua" ||
            item.status === filter;

        // && digunakan agar kedua kondisi harus sesuai
        return cocokSearch && cocokStatus;
    });


    $("reportTableBody").innerHTML =
        data.map(item => {

            return `
                <tr>

                    <td>
                        <strong>${item.id}</strong>
                    </td>

                    <td>
                        <strong>${item.judul}</strong>
                        <br>
                        <small>
                            ${item.lokasi}
                        </small>
                    </td>

                    <td>
                        ${item.pelapor}
                        <br>
                        <small>
                            ${item.kategori}
                        </small>
                    </td>

                    <td>
                        ${badgeStatus(item.status)}
                    </td>

                    <td>

                        <button
                            class="action-btn"
                            onclick="ubahStatus('${item.id}')">
                            Status
                        </button>

                        <button
                            class="action-btn delete"
                            onclick="hapusLaporan('${item.id}')">
                            Hapus
                        </button>

                    </td>

                </tr>
            `;

        }).join("");


    // Jika tidak ada data
    if (data.length === 0) {

        $("reportTableBody").innerHTML = `
            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Tidak ada laporan ditemukan.
                </td>

            </tr>
        `;
    }


    updateStats();
}


/* =====================================================
   UPDATE STATISTIK
===================================================== */

function updateStats() {

    $("totalCount").textContent =
        laporan.length;

    $("waitCount").textContent =
        laporan.filter(
            x => x.status === "Menunggu"
        ).length;

    $("procCount").textContent =
        laporan.filter(
            x => x.status === "Diproses"
        ).length;

    $("doneCount").textContent =
        laporan.filter(
            x => x.status === "Selesai"
        ).length;
}


/* =====================================================
   SUBMIT FORM
===================================================== */

$("reportForm").addEventListener(
    "submit",
    function (e) {

        // Mencegah halaman reload
        e.preventDefault();


        const judul =
            $("judul").value.trim();

        const deskripsi =
            $("deskripsi").value.trim();


        // Validasi judul
        if (judul.length < 5) {

            tampilNotif(
                "Judul minimal 5 karakter.",
                "warning"
            );

            return;
        }


        // Validasi deskripsi
        if (deskripsi.length < 10) {

            tampilNotif(
                "Deskripsi minimal 10 karakter.",
                "warning"
            );

            return;
        }


        // Membuat ID laporan baru
        const nomor =
            laporan.length + 1;

        const idBaru =
            "LPR-" +
            String(nomor).padStart(2, "0");


        // Membuat object laporan
        laporan.push({

            id: idBaru,

            tanggal:
                new Date()
                    .toLocaleDateString("id-ID"),

            pelapor:
                $("pelapor").value,

            kategori:
                $("kategori").value,

            lokasi:
                $("lokasi").value,

            judul: judul,

            deskripsi: deskripsi,

            status: "Menunggu"
        });


        // Simpan ke LocalStorage
        simpanData();

        // Tampilkan data
        renderData();


        // Reset form
        this.reset();


        // Reset counter
        $("charCounter").textContent =
            "0 karakter";


        tampilNotif(
            "Laporan berhasil dikirim."
        );
    }
);


/* =====================================================
   CHARACTER COUNTER
===================================================== */

$("deskripsi").addEventListener(
    "input",
    function () {

        const jumlah =
            this.value.length;

        $("charCounter").textContent =
            `${jumlah} karakter`;


        // Jika kurang dari 10 merah
        if (jumlah < 10) {

            $("charCounter").style.color =
                "#dc2626";

        }

        // Jika sudah 10 hijau
        else {

            $("charCounter").style.color =
                "#16a34a";
        }
    }
);


/* =====================================================
   UBAH STATUS
===================================================== */

function ubahStatus(id) {

    const item =
        laporan.find(x => x.id === id);

    if (!item) return;


    // switch-case untuk mengubah status
    switch (item.status) {

        case "Menunggu":

            item.status = "Diproses";

            break;

        case "Diproses":

            item.status = "Selesai";

            break;

        case "Selesai":

            item.status = "Menunggu";

            break;

        default:

            item.status = "Menunggu";
    }


    simpanData();

    renderData();

    tampilNotif(
        "Status laporan berhasil diubah."
    );
}


/* =====================================================
   HAPUS LAPORAN
===================================================== */

function hapusLaporan(id) {

    laporan =
        laporan.filter(
            x => x.id !== id
        );


    simpanData();

    renderData();

    tampilNotif(
        "Laporan berhasil dihapus."
    );
}


/* =====================================================
   HAPUS LAPORAN TERAKHIR
===================================================== */

$("btnDeleteLast").onclick =
    function () {

        if (laporan.length === 0) {

            tampilNotif(
                "Tidak ada laporan.",
                "warning"
            );

            return;
        }


        laporan.pop();

        simpanData();

        renderData();

        tampilNotif(
            "Laporan terakhir dihapus."
        );
    };


/* =====================================================
   HAPUS SEMUA STATUS SELESAI
===================================================== */

$("btnClearDone").onclick =
    function () {

        const sebelum =
            laporan.length;


        // filter() menghapus laporan yang statusnya Selesai
        laporan =
            laporan.filter(
                x => x.status !== "Selesai"
            );


        if (sebelum === laporan.length) {

            tampilNotif(
                "Tidak ada laporan selesai.",
                "warning"
            );

            return;
        }


        simpanData();

        renderData();

        tampilNotif(
            "Laporan selesai berhasil dihapus."
        );
    };


/* =====================================================
   SEARCH & FILTER
===================================================== */

$("searchBox").addEventListener(
    "input",
    renderData
);

$("statusFilter").addEventListener(
    "change",
    renderData
);


/* =====================================================
   NAVIGASI
===================================================== */

$("btnNavHome").onclick =
    function () {

        $("pageHome")
            .classList.add("active");

        $("pageGuide")
            .classList.remove("active");


        $("btnNavHome")
            .classList.add("active");

        $("btnNavGuide")
            .classList.remove("active");
    };


$("btnNavGuide").onclick =
    function () {

        $("pageGuide")
            .classList.add("active");

        $("pageHome")
            .classList.remove("active");


        $("btnNavGuide")
            .classList.add("active");

        $("btnNavHome")
            .classList.remove("active");
    };


/* =====================================================
   DARK MODE
===================================================== */

// Fungsi untuk membaca tema yang tersimpan
function setTheme() {

    const darkMode =
        localStorage.getItem(THEME_KEY)
        === "dark";


    // Menambahkan class dark ke body
    document.body.classList.toggle(
        "dark",
        darkMode
    );


    const button =
        $("btnDarkMode");


    if (button) {

        button.textContent =
            darkMode ? "☀️" : "🌙";

        button.title =
            darkMode
                ? "Mode Terang"
                : "Dark Mode";
    }
}


/* =====================================================
   BUTTON DARK MODE
===================================================== */

const btnDarkMode =
    $("btnDarkMode");


if (btnDarkMode) {

    btnDarkMode.addEventListener(
        "click",
        function () {

            // Cek apakah mode sekarang dark
            const isDark =
                document.body.classList.toggle(
                    "dark"
                );


            // Simpan pilihan pengguna
            localStorage.setItem(
                THEME_KEY,
                isDark
                    ? "dark"
                    : "light"
            );


            // Ubah icon tombol
            this.textContent =
                isDark
                    ? "☀️"
                    : "🌙";


            this.title =
                isDark
                    ? "Mode Terang"
                    : "Dark Mode";


            tampilNotif(
                isDark
                    ? "🌙 Dark Mode aktif"
                    : "☀️ Mode terang aktif"
            );
        }
    );
}


/* =====================================================
   JALANKAN PROGRAM
===================================================== */

// Terapkan tema yang tersimpan
setTheme();

// Tampilkan data saat halaman dibuka
renderData();

/* =====================================================
   KONFIGURASI
===================================================== */

// Key untuk menyimpan data laporan
const STORAGE_KEY = "ereport_data_v4";

// Key untuk menyimpan tema
const THEME_KEY = "ereport_theme";


/* =====================================================
   DATA AWAL
===================================================== */

let laporan = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [
    {
        id: "LPR-01",
        tanggal: "10/11/2026",
        pelapor: "Muhammad Fairuz",
        kategori: "Internet",
        lokasi: "Gedung A",
        judul: "Kabel Internet Longgar",
        deskripsi:
            "Kabel internet longgar dan dapat membahayakan pengguna.",
        status: "Diproses"
    }
];


/* =====================================================
   HELPER
===================================================== */

const $ = (id) => document.getElementById(id);


/* =====================================================
   SIMPAN DATA
===================================================== */

function simpanData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(laporan)
    );
}


/* =====================================================
   DYNAMIC ISLAND NOTIFIKASI
===================================================== */

function tampilNotif(pesan, tipe = "success") {

    const island = $("dynamicIsland");
    const islandText = $("islandText");

    if (!island || !islandText) return;

    // Set teks pesan
    islandText.textContent = pesan;

    // Tambahkan class show dan expanded agar kapsul membesar dengan animasi spring
    island.classList.add("show", "expanded");

    // Hilangkan efek expanded setelah 1.8 detik (kembali ke kapsul ringkas)
    setTimeout(() => {
        island.classList.remove("expanded");
    }, 1800);

    // Sembunyikan sepenuhnya setelah 3.5 detik
    setTimeout(() => {
        island.classList.remove("show");
    }, 3500);
}


/* =====================================================
   STATUS BADGE
===================================================== */

function badgeStatus(status) {

    switch (status) {

        case "Menunggu":

            return `
                <span class="badge badge-menunggu">
                    Menunggu
                </span>
            `;

        case "Diproses":

            return `
                <span class="badge badge-diproses">
                    Diproses
                </span>
            `;

        case "Selesai":

            return `
                <span class="badge badge-selesai">
                    Selesai
                </span>
            `;

        default:

            return `
                <span class="badge">
                    Tidak diketahui
                </span>
            `;
    }
}


/* =====================================================
   RENDER DATA
===================================================== */

function renderData() {

    const search =
        $("searchBox").value.toLowerCase();

    const filter =
        $("statusFilter").value;


    // filter() digunakan untuk mencari data
    const data = laporan.filter(item => {

        const cocokSearch =
            item.judul.toLowerCase().includes(search) ||
            item.pelapor.toLowerCase().includes(search);

        const cocokStatus =
            filter === "Semua" ||
            item.status === filter;

        // && digunakan agar kedua kondisi harus sesuai
        return cocokSearch && cocokStatus;
    });


    $("reportTableBody").innerHTML =
        data.map(item => {

            return `
                <tr>

                    <td>
                        <strong>${item.id}</strong>
                    </td>

                    <td>
                        <strong>${item.judul}</strong>
                        <br>
                        <small>
                            ${item.lokasi}
                        </small>
                    </td>

                    <td>
                        ${item.pelapor}
                        <br>
                        <small>
                            ${item.kategori}
                        </small>
                    </td>

                    <td>
                        ${badgeStatus(item.status)}
                    </td>

                    <td>

                        <button
                            class="action-btn"
                            onclick="ubahStatus('${item.id}')">
                            Status
                        </button>

                        <button
                            class="action-btn delete"
                            onclick="hapusLaporan('${item.id}')">
                            Hapus
                        </button>

                    </td>

                </tr>
            `;

        }).join("");


    // Jika tidak ada data
    if (data.length === 0) {

        $("reportTableBody").innerHTML = `
            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Tidak ada laporan ditemukan.
                </td>

            </tr>
        `;
    }


    updateStats();
}


/* =====================================================
   UPDATE STATISTIK
===================================================== */

function updateStats() {

    $("totalCount").textContent =
        laporan.length;

    $("waitCount").textContent =
        laporan.filter(
            x => x.status === "Menunggu"
        ).length;

    $("procCount").textContent =
        laporan.filter(
            x => x.status === "Diproses"
        ).length;

    $("doneCount").textContent =
        laporan.filter(
            x => x.status === "Selesai"
        ).length;
}


/* =====================================================
   SUBMIT FORM
===================================================== */

$("reportForm").addEventListener(
    "submit",
    function (e) {

        // Mencegah halaman reload
        e.preventDefault();


        const judul =
            $("judul").value.trim();

        const deskripsi =
            $("deskripsi").value.trim();


        // Validasi judul
        if (judul.length < 5) {

            tampilNotif(
                "Judul minimal 5 karakter.",
                "warning"
            );

            return;
        }


        // Validasi deskripsi
        if (deskripsi.length < 10) {

            tampilNotif(
                "Deskripsi minimal 10 karakter.",
                "warning"
            );

            return;
        }


        // Membuat ID laporan baru
        const nomor =
            laporan.length + 1;

        const idBaru =
            "LPR-" +
            String(nomor).padStart(2, "0");


        // Membuat object laporan
        laporan.push({

            id: idBaru,

            tanggal:
                new Date()
                    .toLocaleDateString("id-ID"),

            pelapor:
                $("pelapor").value,

            kategori:
                $("kategori").value,

            lokasi:
                $("lokasi").value,

            judul: judul,

            deskripsi: deskripsi,

            status: "Menunggu"
        });


        // Simpan ke LocalStorage
        simpanData();

        // Tampilkan data
        renderData();


        // Reset form
        this.reset();


        // Reset counter
        $("charCounter").textContent =
            "0 karakter";


        tampilNotif(
            "Laporan berhasil dikirim."
        );
    }
);


/* =====================================================
   CHARACTER COUNTER
===================================================== */

$("deskripsi").addEventListener(
    "input",
    function () {

        const jumlah =
            this.value.length;

        $("charCounter").textContent =
            `${jumlah} karakter`;


        // Jika kurang dari 10 merah
        if (jumlah < 10) {

            $("charCounter").style.color =
                "#dc2626";

        }

        // Jika sudah 10 hijau
        else {

            $("charCounter").style.color =
                "#16a34a";
        }
    }
);


/* =====================================================
   UBAH STATUS
===================================================== */

function ubahStatus(id) {

    const item =
        laporan.find(x => x.id === id);

    if (!item) return;


    // switch-case untuk mengubah status
    switch (item.status) {

        case "Menunggu":

            item.status = "Diproses";

            break;

        case "Diproses":

            item.status = "Selesai";

            break;

        case "Selesai":

            item.status = "Menunggu";

            break;

        default:

            item.status = "Menunggu";
    }


    simpanData();

    renderData();

    tampilNotif(
        `Status ${id} diubah ke ${item.status}.`
    );
}


/* =====================================================
   HAPUS LAPORAN
===================================================== */

function hapusLaporan(id) {

    laporan =
        laporan.filter(
            x => x.id !== id
        );


    simpanData();

    renderData();

    tampilNotif(
        `Laporan ${id} berhasil dihapus.`
    );
}


/* =====================================================
   HAPUS LAPORAN TERAKHIR
===================================================== */

$("btnDeleteLast").onclick =
    function () {

        if (laporan.length === 0) {

            tampilNotif(
                "Tidak ada laporan.",
                "warning"
            );

            return;
        }


        laporan.pop();

        simpanData();

        renderData();

        tampilNotif(
            "Laporan terakhir dihapus."
        );
    };


/* =====================================================
   HAPUS SEMUA STATUS SELESAI
===================================================== */

$("btnClearDone").onclick =
    function () {

        const sebelum =
            laporan.length;


        // filter() menghapus laporan yang statusnya Selesai
        laporan =
            laporan.filter(
                x => x.status !== "Selesai"
            );


        if (sebelum === laporan.length) {

            tampilNotif(
                "Tidak ada laporan selesai.",
                "warning"
            );

            return;
        }


        simpanData();

        renderData();

        tampilNotif(
            "Laporan selesai dibersihkan."
        );
    };


/* =====================================================
   SEARCH & FILTER
===================================================== */

$("searchBox").addEventListener(
    "input",
    renderData
);

$("statusFilter").addEventListener(
    "change",
    renderData
);


/* =====================================================
   NAVIGASI
===================================================== */

$("btnNavHome").onclick =
    function () {

        $("pageHome")
            .classList.add("active");

        $("pageGuide")
            .classList.remove("active");


        $("btnNavHome")
            .classList.add("active");

        $("btnNavGuide")
            .classList.remove("active");

        tampilNotif("Beranda Aktif");
    };


$("btnNavGuide").onclick =
    function () {

        $("pageGuide")
            .classList.add("active");

        $("pageHome")
            .classList.remove("active");


        $("btnNavGuide")
            .classList.add("active");

        $("btnNavHome")
            .classList.remove("active");

        tampilNotif("Panduan Sistem Dibuka");
    };


/* =====================================================
   DARK MODE
===================================================== */

// Fungsi untuk membaca tema yang tersimpan
function setTheme() {

    const darkMode =
        localStorage.getItem(THEME_KEY)
        === "dark";


    // Menambahkan class dark ke body
    document.body.classList.toggle(
        "dark",
        darkMode
    );


    const button =
        $("btnDarkMode");


    if (button) {

        button.textContent =
            darkMode ? "☀️" : "🌙";

        button.title =
            darkMode
                ? "Mode Terang"
                : "Dark Mode";
    }
}


/* =====================================================
   BUTTON DARK MODE
===================================================== */

const btnDarkMode =
    $("btnDarkMode");


if (btnDarkMode) {

    btnDarkMode.addEventListener(
        "click",
        function () {

            // Cek apakah mode sekarang dark
            const isDark =
                document.body.classList.toggle(
                    "dark"
                );


            // Simpan pilihan pengguna
            localStorage.setItem(
                THEME_KEY,
                isDark
                    ? "dark"
                    : "light"
            );


            // Ubah icon tombol
            this.textContent =
                isDark
                    ? "☀️"
                    : "🌙";


            this.title =
                isDark
                    ? "Mode Terang"
                    : "Dark Mode";


            tampilNotif(
                isDark
                    ? "🌙 Dark Mode aktif"
                    : "☀️ Mode terang aktif"
            );
        }
    );
}


/* =====================================================
   JALANKAN PROGRAM
===================================================== */

// Terapkan tema yang tersimpan
setTheme();

// Tampilkan data saat halaman dibuka
renderData();