document.addEventListener("DOMContentLoaded", function () {

    const users = document.querySelectorAll(".user-item");

    users.forEach(user => {
        user.addEventListener("click", function (e) {
            e.stopPropagation();

            if (!togglePanel("user-properties",this.dataset.username)){
                return;
            }

            document.getElementById("details-title").innerHTML = "👤 " + this.dataset.username;
            document.getElementById("user-username").innerHTML = `<span style="font-weight:bold;">${this.dataset.username}</span>`;
            document.getElementById("user-fullname").textContent = this.dataset.fullname;
            document.getElementById("user-email").textContent = this.dataset.email;
            document.getElementById("user-role").innerHTML = `<span style="font-weight:bold;">${this.dataset.role}</span>`;
            document.getElementById("user-enabled").textContent = this.dataset.enabled;
            
        });

    });

});