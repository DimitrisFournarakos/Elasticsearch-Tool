document.addEventListener("DOMContentLoaded", function () {
    const indices = document.querySelectorAll(".index-item");

    indices.forEach(index => {
        index.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!togglePanel("index-properties",this.dataset.name)){
                return;
            }

            if (document.getElementById("index-properties").style.display !== "block"){
                return;
            }
            document.getElementById("details-title").innerHTML ="📂 " + this.dataset.displayName;
            document.getElementById("index-name").textContent =this.dataset.name;
            document.getElementById("index-docs").textContent =this.dataset.docs;
            document.getElementById("index-size").textContent =this.dataset.size;
            document.getElementById("index-health").textContent = this.dataset.health;
            document.getElementById("index-status").textContent = this.dataset.status;
           

        });
    });
});

