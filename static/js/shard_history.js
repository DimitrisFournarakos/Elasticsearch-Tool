let shardAllocationChart = null;
let shardHealthChart = null;

async function loadShardHistory(clusterName,period = "24h"){
    const response = await fetch(`/shard-history/${clusterName}/?period=${period}`);
    const data = await response.json();
    const history = data.history;

    // Default Record when the cluster is empty
    if(history.length === 0)
    {
        history.push({started: 0,relocating: 0,initializing: 0,unassigned: 0,total_storage_bytes: 0,timestamp: new Date().toISOString()});
    }

        const latest = history[history.length - 1];
        document.getElementById("shard-started").textContent = latest.started;
        document.getElementById( "shard-relocating").textContent = latest.relocating;
        document.getElementById("shard-initializing").textContent = latest.initializing;
        document.getElementById("shard-unassigned").textContent = latest.unassigned;
        document.getElementById("shard-total-events").textContent = history.length;

        
        //Shard Health Status
        const shardHealthElement = document.getElementById("shard-history-health-status");
        
        
        if(latest.unassigned > 0){
            shardHealthElement.innerHTML = `<span style="color:white; "> 🔴 Critical</span>`;
        }
        else if(latest.initializing > 0 || latest.relocating > 5){
            shardHealthElement.innerHTML = `<span style="color:white; "> 🟡 Warning</span>`;
        }
        else{
            shardHealthElement.innerHTML = `<span style="color:white; "> 🟢 Healthy</span>`;
        }

        
        //Recent Events
        const events = document.getElementById("shard-events");
        events.innerHTML = "";

        history.slice().reverse().forEach((item,index) => {
            const date = new Date(item.timestamp).toLocaleString("en-EN",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    });

                    let eventLabel = "➜ Stable";
                    let eventColor = "#4fc3f7";
                    let changeText = "0 Changes";
                    const originalIndex = history.length - 1 - index;
            
            if(originalIndex > 0){
                const previous = history[originalIndex - 1];
                const relocatingDiff = item.relocating - previous.relocating;
                const initializingDiff = item.initializing - previous.initializing;
                const unassignedDiff = item.unassigned - previous.unassigned;

                if(unassignedDiff > 0){
                    changeText = `+${unassignedDiff} Unassigned`;
                    eventLabel = "❌ Allocation Issue";
                    eventColor = "#ff4d4d";
                }else if(relocatingDiff > 0 || initializingDiff > 0){
                    changeText = `+${relocatingDiff + initializingDiff} Rebalancing`;
                    eventLabel = "⚠ Rebalancing";
                    eventColor = "#ffd700";
                }else if(unassignedDiff < 0 || initializingDiff < 0){
                    const recovered = Math.abs(unassignedDiff) + Math.abs(initializingDiff);
                    changeText =`${recovered} Recovered`;
                    eventLabel = "📈 Recovery Detected";
                    eventColor = "#00ff88";
                }
            }

            events.innerHTML += `<div class="shard-event-row"><span>${date}</span><span class="shard-event-change">${changeText}</span><span class="shard-event-status" style="color:${eventColor};">${eventLabel}</span></div>`;
        });


        const healthyEvents = history.filter(item => item.unassigned === 0).length;
        const availability = (healthyEvents / history.length) * 100;

        document.getElementById("shard-availability").textContent = availability.toFixed(2) + "%";
        

        let trend = "→ Stable";
        if(history.length >= 2){
            const first = history[0];
            const last = history[history.length - 1];
            const firstIssues = first.unassigned + first.initializing;
            const lastIssues = last.unassigned + last.initializing;
            if(lastIssues < firstIssues){
                trend = "↗ Improving";
            }
            else if(lastIssues > firstIssues){
                trend = "↘ Degrading";
            }
        }
        document.getElementById("shard-trend").textContent = trend;

        const labels = [];
        const startedValues = [];
        const relocatingValues = [];
        const initializingValues = [];
        const unassignedValues = [];

        history.forEach(item => {
            const label = new Date(item.timestamp).toLocaleString("en-EN",
                {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    
        labels.push(label);
        startedValues.push(item.started);
        relocatingValues.push(item.relocating);
        initializingValues.push(item.initializing);
        unassignedValues.push(item.unassigned);
    });

        //Chart 1
        const allocationCtx = document.getElementById("shardAllocationChart");
        if(shardAllocationChart){
            shardAllocationChart.destroy();
        }
        shardAllocationChart = new Chart(allocationCtx,
            {
                type: "line",
                data:
                {
                    labels: labels,

                    datasets:
                    [
                        {
                            label: "Started",

                            data:
                                startedValues,

                            borderColor:
                                "#00ff88",

                            tension: 0.3
                        },
                        {
                            label: "Relocating",

                            data:
                                relocatingValues,

                            borderColor:
                                "#2196F3",

                            tension: 0.3
                        }
                    ]
                },
                options:
                {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        );


        //Chart 2
        const healthCtx = document.getElementById("shardHealthChart");
        if(shardHealthChart){
            shardHealthChart.destroy();
        }

        shardHealthChart = new Chart(healthCtx,
            {
                type: "line",

                data:
                {
                    labels: labels,

                    datasets:
                    [
                        {
                            label: "Initializing",

                            data:
                                initializingValues,

                            borderColor:
                                "#ffd700",

                            tension: 0.3
                        },
                        {
                            label: "Unassigned",

                            data:
                                unassignedValues,

                            borderColor:
                                "#ff4d4d",

                            tension: 0.3
                        }
                    ]
                },
                options:
                {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        );

}

document.addEventListener("DOMContentLoaded",function (){
        document.querySelectorAll(".shard-history-item").forEach(item =>{
            item.addEventListener("click",function (){
                    if(!togglePanel("shard-history-properties","shard-history")){
                        return;
                    }

                    document.getElementById("details-title").innerHTML ="📊 Shard Growth History";
                    loadShardHistory(this.dataset.cluster);

                    const shardFilter = document.getElementById("shard-period");
                    if(shardFilter){
                        shardFilter.addEventListener("change",function (){
                                const clusterName = document.querySelector(".shard-history-item").dataset.cluster;
                                loadShardHistory(clusterName,this.value);
                        });
                    }

                }                
            );
        });
    }
);