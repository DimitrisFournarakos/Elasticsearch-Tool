let clusterHealthChart = null;

async function loadClusterHealthHistory(clusterName,period = "24h")
{
    const response = await fetch(`/cluster-health-history/${clusterName}/?period=${period}`);
    const data = await response.json();
    const history = data.history;
    const currentStatus = data.current_status;
    const latestEvent = history[history.length - 1].status.toLowerCase();

    document.getElementById("history-cluster-name").textContent = clusterName;
    document.getElementById("history-total-events").textContent = history.length;

    //Calculate Availability->Availability = (Total Events / Healthy Events) * 100
    const greenEvents =history.filter(item => item.status === "green").length;
    const availability = history.length > 0 ? ( greenEvents / history.length ) * 100 : 0;
    document.getElementById("history-availability").textContent = availability.toFixed(2) + "%";

    let trend = "Stable";
        if(history.length >= 2){
            const previous = history[history.length - 2].status;
            const current =history[history.length - 1].status;
            const score ={red: 1,yellow: 2,green: 3};

            if(score[current] > score[previous]){
                trend = "↗ Improving";
            }
            else if(score[current] < score[previous]){
                trend = "↘ Degrading";
            }
            else{
                trend = "→ Stable";
            }
        }
        document.getElementById("history-trend").textContent = trend;


    const icon = currentStatus === "green" ? "🟢 " : currentStatus === "yellow" ? "🟡" : "🔴";
    document.getElementById("history-current-status").innerHTML = `<span style="color:white;font-weight:bold;"> ${icon} ${ currentStatus === "green" ? "Green" : currentStatus === "yellow" ? "Yellow" : "Red" }</span>`;
    
    //Calculate Latest Recorded Event
    const latestIcon = latestEvent === "green" ? "🟢 " : latestEvent === "yellow" ? "🟡" : "🔴";
    document.getElementById("history-last-status").innerHTML = `<span style="color:white;font-weight:bold;">${latestIcon} ${latestEvent === "green" ? "Green" : latestEvent === "yellow" ? "Yellow" : "Red"}</span>`;

    if (!data || data.length === 0){
            document.getElementById("history-cluster-name").textContent = clusterName;
            document.getElementById("health-events").innerHTML ="<div>No historical data available yet.</div>";
            return;
        }

    const labels = [];
    const values = [];

    history.forEach(entry =>{
        const formattedLabel = new Date(entry.timestamp).toLocaleString("en-EN",
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "2-digit",
                                                                            year: "2-digit",

                                                                            hour: "2-digit",
                                                                            minute: "2-digit"
                                                                        });
                                                                        labels.push(formattedLabel);
                                                                            if(entry.status === "green")
                                                                                values.push(3);
                                                                            else if(entry.status === "yellow")
                                                                                values.push(2);
                                                                            else
                                                                                values.push(1);
                        });


    const ctx = document.getElementById("clusterHealthChart");
    if (clusterHealthChart){
        clusterHealthChart.destroy();
    }

    clusterHealthChart = new Chart(ctx, {
        type: 'line',
        data:
        { 
            labels: labels,

            datasets:
            [{
                label: 'Cluster Health',
                data: values,
                borderColor: '#00ff88',
                tension: 0.3
            }]
        },
        options:
        {
            responsive: true,
            maintainAspectRatio: false,

            plugins:
            {
                legend:
                {

                    labels:
                    {
                        color:"#ffffff"
                    }
                }
            },
            scales:
            {
                y:
                {
                    min: 1,
                    max: 3,

                     grid:
                        {
                            color: "#444"
                        },
                x:
                {
                    grid:
                    {
                        color: "#444"
                    },

                    ticks:
                    {
                        color: "#ffffff"
                    }
                },
                    ticks:
                    {
                        color: "#ffffff",

                        callback: function(value)
                        {
                            if(value === 3) return "GREEN";
                            if(value === 2) return "YELLOW";
                            if(value === 1) return "RED";
                        }
                    }
                }
            }
        }

    });

    const events = document.getElementById("health-events");

    events.innerHTML = "";
    history.slice().reverse().forEach(item =>
    {
            const color = item.status === "green" ? "#00ff88": item.status === "yellow" ? "#ffd700" : "#ff4d4d";
            const formattedDate = new Date(item.timestamp).toLocaleString("en-EN",
                                                                                {
                                                                                    year: "numeric",
                                                                                    month: "2-digit",
                                                                                    day: "2-digit",

                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                    second: "2-digit"
                                                                                }
                                                                         );

        const status = item.status.toLowerCase();
        const statusColor = status === "green" ? "#00ff88" : status === "yellow" ? "#ffd700" : "#ff4d4d";
        const statusIcon = status === "green"  ? "🟢"  : status === "yellow"  ? "🟡" : "🔴";

        events.innerHTML += `<div style="margin-bottom:4px;">${formattedDate} - <span style="color:${statusColor};font-weight:bold;">${statusIcon}${status === "green" ? "Green" : status === "yellow" ? "Yellow" : "Red"}</span></div>`;
    
    });
}

document.addEventListener("DOMContentLoaded", function (){
    const historyNode = document.querySelector(".cluster-health-history-item");

    if (!historyNode){
        return;
    }

    historyNode.addEventListener("click", async function (e){
        e.stopPropagation();

        if (!togglePanel("cluster-health-history-properties","history-" + this.dataset.cluster)){
            return;
        }

        document.getElementById("details-title").innerHTML = "📊 " + this.dataset.cluster;
        await loadClusterHealthHistory(this.dataset.cluster);

    });
    const filter = document.getElementById("history-period");

    if(filter)
    {
        filter.addEventListener("change",
            async function(){
                const clusterName = document.getElementById("history-cluster-name").textContent;
                await loadClusterHealthHistory(clusterName,this.value);
            }
        );
    }

});