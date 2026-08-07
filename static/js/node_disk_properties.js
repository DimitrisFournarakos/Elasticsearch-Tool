document.addEventListener("DOMContentLoaded",function () {
        const nodes = document.querySelectorAll(".node-monitoring-item");

        nodes.forEach(node => {

            node.addEventListener("click", function (e) {
                    e.stopPropagation();

                    if (!togglePanel( "node-disk-properties", this.dataset.name)){
                        return;
                    }

                    document.getElementById("details-title").innerHTML = "📄 " + this.dataset.name;
                    document.getElementById("monitor-node").textContent =this.dataset.name;
                    document.getElementById("monitor-primary").textContent =this.dataset.primary;
                    document.getElementById("monitor-replica").textContent =this.dataset.replica;
                    document.getElementById("monitor-total").textContent =this.dataset.totalShards;
                    document.getElementById("monitor-disk-total").textContent = this.dataset.total;
                    document.getElementById("monitor-disk-used").textContent = this.dataset.used;
                    document.getElementById("monitor-disk-free").textContent = this.dataset.free;
                    document.getElementById("monitor-disk-percent").textContent = this.dataset.percent + " %";

                    //Εδώ θα εμφανίσω το status,συμφωνα με το πόσο % του αποθηκευτικού χώρου χρησιμοποιείται 
                    const usage = parseFloat(this.dataset.percent);
                    let status = "";

                    if (usage >= 95) {
                        status = "🔴 Critical";
                    }
                    else if (usage >= 85) {
                        status = "🟠 High";
                    }
                    else if (usage >= 75){
                        status= "🟡 Warning"
                    }
                    else {
                        status = "🟢 Healthy";
                    }
                    document.getElementById("monitor-status").textContent = status;
                }
            );

        });

    }
);