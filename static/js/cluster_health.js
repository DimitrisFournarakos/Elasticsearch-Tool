document.addEventListener("DOMContentLoaded", function () {
    
    const healthNode = document.querySelector(".cluster-health-item");

    healthNode.addEventListener("click", function (e) {
        e.stopPropagation();       
        
        if (!togglePanel("cluster-health-properties",this.dataset.cluster)){
                 return;
        }

        document.getElementById("details-title").innerHTML = "📈 " + this.dataset.cluster;
        document.getElementById("health-cluster-name").textContent = this.dataset.cluster;
        document.getElementById("health-cluster-nodes").textContent = this.dataset.nodes;
        document.getElementById("health-cluster-data-nodes").textContent = this.dataset.dataNodes;
        document.getElementById("health-cluster-shards").textContent = this.dataset.shards;
        document.getElementById("health-cluster-primary").textContent = this.dataset.primary;
        document.getElementById("health-cluster-unassigned").textContent = this.dataset.unassigned;
        document.getElementById("health-cluster-pending").textContent =this.dataset.pending;

        const status = this.dataset.status.toLowerCase();
        const statusElement = document.getElementById("health-cluster-status");
        if (status === "green") {
            statusElement.innerHTML = `🟢 Green`;
        }else if (status === "yellow") {
            statusElement.innerHTML = `🟡 Yellow`;
        }else {
            statusElement.innerHTML = `🔴 Red`;
        }

    });
});