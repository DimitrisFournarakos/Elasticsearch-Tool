document.addEventListener("DOMContentLoaded",function () {
        const cluster = document.querySelector(".cluster-monitoring-item");

        if (!cluster) {
            return;
        }

        cluster.addEventListener("click",function (e) {
                e.stopPropagation();

                if (!togglePanel("cluster-monitoring-properties",this.dataset.name)){
                    return;
                }
                document.getElementById("details-title").innerHTML ="📄 " + this.dataset.name;
                document.getElementById("cluster-monitor-name").innerHTML = `<span style="font-weight:bold;">${this.dataset.name}</span>`;
                document.getElementById("cluster-monitor-nodes").textContent = this.dataset.nodes;
                document.getElementById("cluster-monitor-data-nodes").textContent = this.dataset.dataNodes;

                document.getElementById("cluster-monitor-shards").textContent = this.dataset.shards;
                document.getElementById("cluster-monitor-primary").textContent = this.dataset.primary;
                document.getElementById("cluster-monitor-pending").textContent = this.dataset.pending;
                document.getElementById("cluster-monitor-unassigned").textContent = this.dataset.unassigned;

                document.getElementById("cluster-monitor-total").textContent = this.dataset.total;
                document.getElementById("cluster-monitor-used").textContent = this.dataset.used;
                document.getElementById("cluster-monitor-free").textContent = this.dataset.free;
                document.getElementById("cluster-monitor-usage").textContent =this.dataset.usage + " %";
                
                const usage = parseFloat(this.dataset.usage);
                let diskStatus = "";

                if (usage >= 95) {
                    diskStatus = "🔴 Critical";
                }
                else if (usage >= 85) {
                    diskStatus = "🟠 High";
                }
                else if (usage >= 75) {
                    diskStatus = "🟡 Warning";
                }
                else {
                    diskStatus = "🟢 Healthy";
                }

                document.getElementById("cluster-monitor-disk-status").innerHTML = `<span style="color:white; font-weight:bold;">${diskStatus}</span>`;
            }
        );

    }
);