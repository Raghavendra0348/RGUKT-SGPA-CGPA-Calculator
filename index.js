   const firebaseConfig = {
                        apiKey: "AIzaSyBa5bYbUgLiluU6eCimeA8-jVx1i4_xRmA",
                        authDomain: "rgukt-sgpa-cgpa-calculator.firebaseapp.com",
                        projectId: "rgukt-sgpa-cgpa-calculator",
                        storageBucket: "rgukt-sgpa-cgpa-calculator.firebasestorage.app",
                        messagingSenderId: "71013965900",
                        appId: "1:71013965900:web:9dc65476149f6ff91954e9",
                        measurementId: "G-K22L37T7Z2"
                };

                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);
                const auth = firebase.auth();

                // Refresh logo click
                function refreshLogo() {
                        window.location.reload();
                }

                // Toggle side menu
                function toggleMenu() {
                        document.querySelector('.menu-bar').classList.toggle('open');
                        document.querySelector('.menu-overlay').classList.toggle('open');
                }

                // Navigate to other pages
    function navigateTo(page) {
        window.location.href = page;
    }

    function logout() {
        auth.signOut().then(() => {
            alert("You have logged out.");
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error("Logout error:", error);
        });
    }

    // Dropdown references
    const dropdown = document.getElementById("user-dropdown");
    const overlay = document.getElementById("user-dropdown-overlay");

    function toggleDropdown(e) {
        e.stopPropagation(); // Prevent immediate close
        dropdown.classList.toggle("show");
        overlay.style.display = dropdown.classList.contains("show") ? "block" : "none";
    }

    // Close dropdown on outside click, scroll, resize
    overlay.addEventListener("click", () => {
        dropdown.classList.remove("show");
        overlay.style.display = "none";
    });

    window.addEventListener("scroll", () => {
        dropdown.classList.remove("show");
        overlay.style.display = "none";
    });

    window.addEventListener("resize", () => {
        dropdown.classList.remove("show");
        overlay.style.display = "none";
    });

    // ✅ Firebase Auth State
    firebase.auth().onAuthStateChanged((user) => {
        const signupBtn = document.getElementById("signup-btn");
        const dropdownImg = document.getElementById("dropdown-profile-img");
        const nameDisplay = document.getElementById("user-name");
        const emailDisplay = document.getElementById("user-email");

        const mobileBtn = document.getElementById("mobile-profile-btn");
        const mobileProfileContent = document.getElementById("mobile-profile-content");

        if (user) {
            const profileURL = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;

            // Desktop view
            signupBtn.innerHTML = `<img src="${profileURL}" alt="User" style="height: 30px; width: 30px; border-radius: 50%; vertical-align: middle;">`;
            signupBtn.onclick = toggleDropdown;

            // Mobile view
            mobileBtn.style.display = "inline-flex";
            mobileProfileContent.innerHTML = `<img src="${profileURL}" alt="User">`;
            mobileBtn.onclick = toggleDropdown;

            // Dropdown content
            dropdownImg.src = profileURL;
            nameDisplay.textContent = user.displayName || "RGUKT User";
            emailDisplay.textContent = user.email;
        } else {
            // Desktop (Logged out)
            signupBtn.textContent = "Signup";
            signupBtn.onclick = () => navigateTo('login.html');

            // Mobile (Logged out)
            mobileBtn.style.display = "inline-flex";
            mobileProfileContent.textContent = "Signup";
            mobileBtn.onclick = () => navigateTo('login.html');
        }
    });
