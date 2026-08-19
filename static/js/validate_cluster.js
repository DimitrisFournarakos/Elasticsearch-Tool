document.addEventListener("DOMContentLoaded", function(){
    const validateBtn = document.getElementById("validate-cluster-btn");

    if(!validateBtn){
        return;
    }

    validateBtn.addEventListener("click",
        async function(){
            const url = document.getElementById("form-cluster-url").value;
            const username = document.getElementById( "cluster-username").value;
            const password = document.getElementById("cluster-password").value;
            const result = document.getElementById("cluster-validation-result");

            const errorPanel = document.getElementById("cluster-validation-error");
            errorPanel.classList.remove("show");
            errorPanel.style.display = "none";

            const clusterInfo = document.getElementById("cluster-detected-info");
            clusterInfo.classList.remove("show");
            clusterInfo.style.display = "none";

            document.getElementById("save-cluster-btn").disabled = true;
            result.innerHTML = "";



            try{
                function getCookie(name) {

                    let cookieValue = null;
                    if (document.cookie && document.cookie !== '') {
                        const cookies = document.cookie.split(';');

                        for (let i = 0; i < cookies.length; i++) {
                            const cookie = cookies[i].trim();

                            if (cookie.substring(0,name.length + 1) === (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                                break;
                            }
                        }
                    }

                    return cookieValue;
                }

                const csrftoken = getCookie('csrftoken');
                
                const response = await fetch("/validate-cluster/",{
                        method:"POST",
                        headers:{"Content-Type":"application/json", "X-CSRFToken": csrftoken},
                        body:JSON.stringify({url,username,password})
                    });

                const data = await response.json();

                if(data.success){ 
                    const clusterInfo = document.getElementById("cluster-detected-info");

                    clusterInfo.style.display = "block";
                    setTimeout(() => {clusterInfo.classList.add("show");}, 10);

                    document.getElementById("detected-cluster-name").textContent = data.cluster_name;
                    document.getElementById("detected-cluster-url").textContent = data.url;
                    document.getElementById("save-cluster-btn").disabled = false;
                }else{
                    document.getElementById("cluster-detected-info").classList.remove("show");
                    document.getElementById("cluster-detected-info").style.display = "none";

                    errorPanel.style.display = "block";
                    setTimeout(() => {errorPanel.classList.add("show");}, 10);

                }

            }catch(error){
                clusterInfo.classList.remove("show");
                clusterInfo.style.display = "none";

                result.innerHTML ="❌ Connection Failed";

            }

        }
    );

});

