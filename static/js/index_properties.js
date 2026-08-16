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
            document.getElementById("index-name").innerHTML = `<span style="font-weight:bold;">${this.dataset.name}</span>`;
            document.getElementById("index-docs").textContent =this.dataset.docs;
            document.getElementById("index-size").textContent =this.dataset.size;
            
            //Index Health , Style
            const health = this.dataset.health.toLowerCase();
            const healthElement = document.getElementById("index-health");

            if(health === "green"){
                healthElement.innerHTML = `<span style=" color:white; font-weight:bold;">🟢 Green</span>`;
            }
            else if(health === "yellow"){
                healthElement.innerHTML = `<span style="color:white;font-weight:bold;"> 🟡 Yellow</span>`;
            }
            else{
                healthElement.innerHTML = `<span style="color:white; font-weight:bold;"> 🔴 Red</span>`;
            }
            
            //Index Status , Style
            const status = this.dataset.status.toLowerCase();
            const statusElement = document.getElementById("index-status");

            if(status === "open"){
                statusElement.innerHTML = `<span style="color:white; font-weight:bold;"> 🟢 Open</span>`;
            }else{
                statusElement.innerHTML =`<span style=" color:white; font-weight:bold;"> 🔴 Closed</span>`;
            }
           

        });
    });
});

