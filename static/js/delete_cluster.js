document.addEventListener("DOMContentLoaded", function(){
    const deleteBtn = document.getElementById("delete-cluster-btn");

    if(!deleteBtn){
        return;
    }

    deleteBtn.addEventListener("click",async function(){
            const clusterId = this.dataset.clusterId;

            document.getElementById("delete-cluster-name").textContent = document.getElementById( "cluster-name").textContent;
            const panel = document.getElementById( "cluster-delete-confirmation");
            document.getElementById("cluster-save-message").style.display = "none";

            panel.style.display = "block";
            panel.classList.remove("show");
            setTimeout(() => {panel.classList.add("show");}, 10);
           
        });

    //Cancel Button
    const cancelBtn = document.getElementById("cancel-delete-btn");

    cancelBtn.addEventListener("click", function(){
        const panel = document.getElementById("cluster-delete-confirmation");
        panel.classList.remove("show");
        panel.style.display = "none";
    });
    
    //Confirm Button
    const confirmBtn = document.getElementById("confirm-delete-btn");

    confirmBtn.addEventListener("click",async function(){
        const clusterId = document.getElementById("delete-cluster-btn").dataset.clusterId;
        const csrftoken = getCookie("csrftoken");

        try{
            const response = await fetch("/delete-cluster/",{
                        method:"POST",
                        headers:{"Content-Type":"application/json","X-CSRFToken": csrftoken},
                        body:JSON.stringify({id: clusterId})
                    });

            const data = await response.json();

            if(data.success){
                const message = document.getElementById("cluster-save-message");

                message.className = "cluster-save-message cluster-save-success";
                document.getElementById("cluster-save-header").innerHTML = "✅ Cluster Deleted";
                document.getElementById( "cluster-save-text").innerHTML = "The cluster has been deleted successfully.";
                message.style.display = "block";
                message.classList.remove("show");
                setTimeout(() => { message.classList.add("show");},10);

                document.getElementById("cluster-delete-confirmation").classList.remove("show");
                document.getElementById("cluster-delete-confirmation").style.display = "none";

                await refreshClusterList();

                document.getElementById("cluster-delete-confirmation").style.display ="none";
                document.getElementById("cluster-properties").style.display ="none";
                document.getElementById("details-title").innerHTML = "";

            }else{

                const message = document.getElementById("cluster-save-message");
                message.className = "cluster-save-message cluster-save-error";
                document.getElementById("cluster-save-header").innerHTML = "❌ Delete Failed";
                document.getElementById("cluster-save-text").innerHTML = data.error;
                message.style.display = "block";
            }

        }catch(error){
            const message = document.getElementById("cluster-save-message");

            message.className = "cluster-save-message cluster-save-error";
            document.getElementById("cluster-save-header").innerHTML = "❌ Delete Failed";
            document.getElementById("cluster-save-text").innerHTML = "Unable to delete cluster.";
            message.style.display = "block";

        }
    });

});

function getCookie(name){
    let cookieValue = null;

    if(document.cookie){
        const cookies = document.cookie.split(";");

        for(let i=0;i<cookies.length;i++){
            const cookie = cookies[i].trim();

            if(cookie.substring(0,name.length + 1) === (name + "=")){
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }

        }
    }

    return cookieValue;

}