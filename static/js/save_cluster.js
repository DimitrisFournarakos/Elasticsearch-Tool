document.addEventListener("DOMContentLoaded", function(){
    const saveBtn = document.getElementById("save-cluster-btn");

    if(!saveBtn){
        return;
    }

    saveBtn.addEventListener("click", async function(){
            const clusterName = document.getElementById("detected-cluster-name").textContent;
            const url = document.getElementById("form-cluster-url").value;
            const username = document.getElementById("cluster-username").value;
            const password = document.getElementById("cluster-password").value;
            const environment = document.getElementById("form-cluster-environment").value;

            //MAKE Environmet field required
            if(!environment){
                const message = document.getElementById("cluster-save-message");
                document.getElementById("cluster-save-header").innerHTML = "❌ Environment Required";
                document.getElementById("cluster-save-text").innerHTML = "Please select an environment before adding the cluster.";
                message.className = "cluster-save-message cluster-save-error";
                message.style.display = "block";

                setTimeout(() => {message.classList.add("show");}, 10);
                return;
            }

            const payload = { 
                id: clusterName.toLowerCase().replace(/\s+/g,"-"),
                name: clusterName,
                url: url,
                username: username,
                password: password,
                environment: environment
            };

            const csrftoken = getCookie("csrftoken");
            const validationError = document.getElementById("cluster-validation-error");
            validationError.classList.remove("show");
            validationError.style.display = "none";
            try{
                const response = await fetch("/save-cluster/",
                        {
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json",
                                "X-CSRFToken": csrftoken
                            },
                            body:
                                JSON.stringify(payload)
                        }
                    );

                const data = await response.json();
                if(data.success){
                    const message = document.getElementById("cluster-save-message");
                    message.className = "cluster-save-message cluster-save-success";
                    document.getElementById("cluster-save-header").innerHTML ="✅ Cluster Added Successfully";
                    document.getElementById("cluster-save-text").innerHTML = "The cluster has been added successfully and will now appear in the cluster list.";
                    message.classList.remove("show");
                    message.style.display = "none";
                    message.style.display = "block";

                    await refreshClusterList();
                    setTimeout(() => {message.classList.add("show");},10);
                    
                }else{
                    const message = document.getElementById("cluster-save-message");

                    message.className = "cluster-save-message cluster-save-error";
                    document.getElementById("cluster-save-header").innerHTML = "❌ Cluster Already Exists";
                    document.getElementById("cluster-save-text").innerHTML = data.error;
                    message.classList.remove("show");
                    message.style.display = "none";
                    message.style.display = "block";

                    setTimeout(() => {message.classList.add("show");}, 10);
                }
                            }catch(error){
                                const message = document.getElementById("cluster-save-message");

                                message.className = "cluster-save-message cluster-save-error";
                                document.getElementById("cluster-save-header").innerHTML = "❌ Save Failed";
                                document.getElementById("cluster-save-text").innerHTML = "Unable to save cluster.";
                                message.classList.remove("show");
                                message.style.display = "none";
                                message.style.display = "block";

                                setTimeout(() => { message.classList.add("show");}, 10);
                            }

                        }
                    );

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


//Refresh Function
async function refreshClusterList(){
    const response = await fetch("/get-clusters/");
    const data = await response.json();
    const clusterList = document.getElementById("cluster-list");

    clusterList.innerHTML = "";

    data.clusters.forEach(cluster => {
        clusterList.innerHTML += 
            `<li class="cluster-item"
                data-id="${cluster.id}"
                data-name="${cluster.name}"
                data-url="${cluster.url}"
                data-environment="${cluster.environment}">

                <span class="node-label">
                    🌐 ${cluster.name}
                </span>
            </li>`;

    });

}