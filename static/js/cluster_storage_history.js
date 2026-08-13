let clusterStorageChart = null;

async function loadClusterStorageHistory(clusterName,period = "24h"){
    const response = await fetch(`/cluster-storage-history/${clusterName}/?period=${period}`);
    const data = await response.json();
    const history = data.history;

                    document.getElementById("storage-total-events").textContent = history.length;
                    let latest = null;
                    if(history.length > 0){
                        latest = history[history.length - 1];

                        document.getElementById("storage-current-usage").textContent = latest.usage_percent + "%";
                    }
                    let diskStatus = "🟢 Healthy";
                    let diskColor = "#00ff88";
                    if(latest && latest.usage_percent >= 90){
                        diskStatus = "🔴 Critical";
                        diskColor = "#ff4d4d";
                    }
                    else if(latest && latest.usage_percent >= 75){
                        diskStatus = "🟡 Warning";
                        diskColor = "#ffd700";
                    }

                    document.getElementById("storage-current-status").innerHTML =`<span style="color:white; font-weight:bold;"> ${diskStatus} </span>`;
                    
                    const healthyEvents = history.filter(item => item.usage_percent < 75).length;
                    const availability = history.length > 0 ? (healthyEvents / history.length) * 100 : 0;
                    document.getElementById("storage-availability").textContent = availability.toFixed(2) + "%";

                    let trend = "→ Stable";
                    if(history.length >= 2){
                        const previous = history[history.length - 2].usage_percent;
                        const current = history[history.length - 1].usage_percent;

                        if(current > previous){
                            trend = "↗ Increasing";
                        }
                        else if(current < previous)
                        {
                            trend = "↘ Decreasing";
                        }
                    }

                    document.getElementById("storage-trend").textContent = trend;
                    
                    const events = document.getElementById("storage-events");
                    events.innerHTML = "";
                    history.slice().reverse().forEach(item =>{
                        const date = new Date(item.timestamp).toLocaleString("en-EN",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true
                                }
                            );

                        let color = "#00ff88";
                        let label = " Healthy ";

                        if(item.usage_percent >= 90){
                            color = "#ff4d4d";
                            label = " Critical ";
                        }
                        else if(item.usage_percent >= 75)
                        {
                            color = "#ffd700";
                            label = " Warning ";
                        }

                        events.innerHTML += `<div style="margin-bottom:8px; ">${date} -<span style=" color:${color}; font-weight:bold;">${label}</span>(${item.usage_percent}%)</div>`;

                    });
                    
                    //Create labels and values for chart
                    const labels = [];
                    const values = [];

                    history.forEach(item =>{
                        const label = new Date(item.timestamp).toLocaleString("en-EN",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            );

                        labels.push(label);
                        values.push(item.usage_percent);
                    });

                    const ctx = document.getElementById("clusterStorageChart");
                    if(clusterStorageChart){
                        clusterStorageChart.destroy();
                    }
                    
                    clusterStorageChart = new Chart(
                        ctx,
                        {
                            type: "line",

                            data:
                            {
                                labels: labels,

                                datasets:
                                [{
                                    label:"Storage Usage %",
                                    data: values,
                                    borderColor:"#4CAF50",
                                    backgroundColor:"rgba(76,175,80,0.15)",
                                    tension: 0.3,
                                    fill: true
                                }]
                            },
                            options:
                            {
                                responsive: true,
                                maintainAspectRatio: false,

                                scales:
                                {
                                    y:
                                    {
                                        min: 0,
                                        max: 100,

                                        title:
                                        {
                                            display: true,

                                            text: "Usage %"
                                        }
                                    }
                                }
                            }
                        }
                    );
}

document.addEventListener("DOMContentLoaded",function (){
        document.querySelectorAll(".cluster-storage-history-item").forEach(item =>{
            item.addEventListener("click",function (){
                    if(!togglePanel("cluster-storage-history-properties",this.dataset.cluster)){
                        return;
                        }

                    const clusterName = this.dataset.cluster;
                    document.getElementById("details-title").innerHTML = `📊 ${clusterName}`;
                    document.getElementById("storage-cluster-name").textContent = clusterName;
                    loadClusterStorageHistory(clusterName);


                    
                }
            );
        });

    const storageFilter = document.getElementById("storage-period");
    if(storageFilter){
        storageFilter.addEventListener("change", function (){
                const clusterName = document.getElementById("storage-cluster-name").textContent;
                loadClusterStorageHistory(clusterName,this.value);

            }
        );
    }
});