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
            console.log(document.getElementById("form-cluster-url"));
            console.log(document.getElementById("form-cluster-url").value);

            result.innerHTML = "Validating...";

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

                if(data.success){ result.innerHTML = "✅ Connection Successful";
                    document.getElementById("cluster-detected-info").style.display = "block";
                    document.getElementById("detected-cluster-name").textContent = data.cluster_name;
                    document.getElementById("detected-cluster-url").textContent = data.url;
                    document.getElementById("save-cluster-btn").disabled = false;
                }else{
                    result.innerHTML = "❌ Validation Failed";
                }

            }catch(error){
                result.innerHTML = "❌ Connection Failed";

            }

        }
    );

});

