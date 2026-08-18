document.addEventListener("DOMContentLoaded",function (){
        const refreshBtn = document.getElementById("refresh-clusters-btn");

        if(refreshBtn){
            refreshBtn.addEventListener("click",function (){
                    location.reload();
                });
        }
});