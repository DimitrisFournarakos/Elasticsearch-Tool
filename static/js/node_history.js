let nodeHistoryChart = null;

async function loadNodeHistory(nodeName,period = "24h"){
    const response = await fetch(`/node-history/${nodeName}/?period=${period}`);
    const data = await response.json();
    const history = data.history;

    //node-total-events
    document.getElementById("node-total-events").textContent = history.length;
    let latest = null;
    if(history.length > 0){
        latest = history[history.length - 1];
        document.getElementById("node-current-usage").textContent = latest.usage_percent + "%";
    }

    //node-current-status
    let diskStatus = "🟢 Healthy";
    if(latest && latest.usage_percent >= 90){
        diskStatus = "🔴 Critical";
    }
    else if(latest && latest.usage_percent >= 75){
        diskStatus = "🟡 Warning";
    }
    document.getElementById("node-current-status").textContent = diskStatus;

    //Calculate node-availability
    const healthyEvents = history.filter(item =>item.usage_percent < 75).length;
    const availability = history.length > 0 ? ( healthyEvents / history.length ) * 100 : 0;
    document.getElementById("node-availability").textContent = availability.toFixed(2) + "%";

    //Calculate node-trend
    let trend = "→ Stable";
    if(history.length >= 2){

        const previous = history[history.length - 2].usage_percent;
        const current = history[history.length - 1].usage_percent;
        if(current > previous){
            trend = "↗ Increasing";
        }
        else if(current < previous)
        {
            trend ="↘ Decreasing";
        }
    }
    document.getElementById("node-trend").textContent = trend;

    //Frame with node-events
    const events = document.getElementById("node-events");
    events.innerHTML = "";
        //Date format 
        history.slice().reverse().forEach((item,index) =>{
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

            let label =" Healthy ";
            let color ="#00ff88";
            if(item.usage_percent >= 90){
                label = " Critical ";
                color = "#ff4d4d";
            }
            else if(item.usage_percent >= 75)
            {
                label = " Warning ";
                color = "#ffd700";
            }

            
            let eventLabel = "➜ Stable";
            let eventColor = "#4fc3f7";
            let usageDiff = 0;

            const originalIndex = history.length - 1 - index;
            if(originalIndex > 0){
                const previous = history[originalIndex - 1];

                usageDiff = item.usage_percent - previous.usage_percent;
                if(usageDiff > 0){
                    eventLabel = "📈 Usage Increased";
                    eventColor = "#00ff88";
                }
                else if(usageDiff < 0){
                    eventLabel = "📉 Usage Reduced";
                    eventColor = "#ffd700";
                }
            }

            const usagePrefix = usageDiff > 0 ? "+" : usageDiff < 0 ? "-" : '<span class="node-event-sign-placeholder"></span>';
            events.innerHTML += `<div class="node-event-row"><span class="node-event-date">${date}</span><span class="node-event-usage">${usagePrefix}${Math.abs(usageDiff).toFixed(2)}%</span><span class="node-event-status"style="color:${eventColor};">${eventLabel}</span></div>`;
        });

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

        //Chart
        const ctx = document.getElementById("nodeHistoryChart");
        if(nodeHistoryChart){
            nodeHistoryChart.destroy();
        }

        nodeHistoryChart = new Chart(
            ctx,
            {
                type: "line",
                data:
                {
                    labels: labels,
                    datasets:
                    [{
                        label: "Node Usage %",
                        data: values,
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76,175,80,0.15)",
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

document.addEventListener("DOMContentLoaded", function (){

    document.querySelectorAll(".node-history-item").forEach(item => {

        item.addEventListener("click", function (){

            if(!togglePanel("node-history-properties",this.dataset.node)){
                return;
            }

            const nodeName = this.dataset.node;
            document.getElementById("node-history-name").textContent = nodeName;
            loadNodeHistory(nodeName);
            document.getElementById("details-title").innerHTML = `📊 ${nodeName}`;

        });

    });

    const nodeFilter = document.getElementById("node-period");
    if(nodeFilter){
        nodeFilter.addEventListener("change",function (){

                const nodeName = document.getElementById("node-history-name").textContent;
                loadNodeHistory(nodeName,this.value);

            });
    }

});