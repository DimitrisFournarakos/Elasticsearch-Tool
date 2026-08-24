document.addEventListener("DOMContentLoaded",
    function () {
        const shardStorage = document.querySelector(".shard-storage-item");

        if (!shardStorage) {
            return;
        }

        shardStorage.addEventListener("click",function (e) {
                e.stopPropagation();
                
                if (!togglePanel("shard-storage-properties","shard-storage")
                ){
                    return;
                }
                
                document.getElementById("details-title").innerHTML ="📄 Shard Storage";
                document.getElementById("shard-storage-total").textContent = this.dataset.total;
                document.getElementById("shard-storage-primary").textContent = this.dataset.primary;
                document.getElementById("shard-storage-replica").textContent = this.dataset.replica;
                document.getElementById("shard-storage-size").textContent = this.dataset.storage;
                document.getElementById("shard-storage-cluster-total").textContent = this.dataset.clusterTotal;
                document.getElementById("shard-storage-cluster-used").textContent = this.dataset.clusterUsed;
                document.getElementById("shard-storage-cluster-free").textContent = this.dataset.clusterFree;

                const shardStorageMB = parseFloat(this.dataset.storage);
                const clusterTotalMB = parseFloat(this.dataset.clusterTotal) * 1024;
                const usage = (shardStorageMB / clusterTotalMB) * 100;

                document.getElementById("shard-storage-usage").textContent = usage.toFixed(2) + " %";

                let status = "";
                if (usage >= 50){
                    status = "🔴 Critical";
                }
                else if (usage >= 25){
                    status = "🟠 High";
                }
                else if (usage >= 10){
                    status = "🟡 Warning";
                }
                else{
                    status = "🟢 Healthy";
                }
                document.getElementById("shard-storage-status").innerHTML = status;
        });

    }
);