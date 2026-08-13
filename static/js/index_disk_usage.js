document.addEventListener("DOMContentLoaded",
    function(){

        const indices =document.querySelectorAll(".index-monitoring-item");
        indices.forEach(index => {index.addEventListener("click",function(e){
                    e.stopPropagation();

                    if(!togglePanel("index-disk-properties",this.dataset.name)){
                        return;
                    }

                    document.getElementById("details-title").innerHTML = "📄 " + this.dataset.displayName;
                    document.getElementById("index-monitor-name").textContent =this.dataset.name;
                    document.getElementById("index-monitor-docs").textContent =this.dataset.docs;
                    document.getElementById("index-monitor-size").textContent =this.dataset.size;

                    //Βοηθητική συνάρτηση για να μετατρέπει τα gb,mb,kb σε bytes.
                    function sizeToBytes(size){
                        const value = parseFloat(size);
                        const unit = size.toLowerCase();

                        if(unit.includes("gb")){
                            return value * 1024 * 1024 * 1024;
                        }
                        if(unit.includes("mb")){
                            return value * 1024 * 1024;
                        }
                        if(unit.includes("kb")){
                            return value * 1024;
                        }

                        return value;
                    }
                    //--------------------------------------------------------
                    const indexSize = sizeToBytes(this.dataset.size);
                    const clusterSize = parseFloat(this.dataset.clusterTotal) * 1024 * 1024 * 1024;
                    const usage = (indexSize / clusterSize) * 100;

                    document.getElementById("index-monitor-usage").textContent = usage.toFixed(2) + " %";

                    let diskStatus = "";
                    if (usage >= 50){
                        diskStatus = "🔴 Critical";
                    }
                    else if (usage >= 25){
                        diskStatus = "🟠 High";
                    }
                    else if (usage >= 10){
                        diskStatus = "🟡 Warning";
                    }
                    else{
                        diskStatus = "🟢 Healthy";
                    }

                    document.getElementById("index-monitor-status").innerHTML = diskStatus;
                    document.getElementById("index-monitor-cluster-total").textContent = this.dataset.clusterTotal;
                    document.getElementById("index-monitor-cluster-used").textContent = this.dataset.clusterUsed;
                    document.getElementById("index-monitor-cluster-free").textContent = this.dataset.clusterFree;
                }
            );

        });

    }
);