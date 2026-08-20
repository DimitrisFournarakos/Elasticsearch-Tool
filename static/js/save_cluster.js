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


            const payload = { 
                id: clusterName.toLowerCase().replace(/\s+/g,"-"),
                name: clusterName,
                url: url,
                username: username,
                password: password,
                environment: environment
            };

            const csrftoken = getCookie("csrftoken");
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

                    location.reload();
                }else{
                    alert(data.error);
                }

            }catch(error){
                alert("Unable to save cluster.");
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
