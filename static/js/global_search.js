document.addEventListener("DOMContentLoaded", function(){
    const input = document.getElementById("global-search");
    const results = document.getElementById("global-search-results");

    if(!input){
        return;
    }

    input.addEventListener("input",function(){
            const value = this.value.toLowerCase().trim();
            results.innerHTML = "";

            if(!value){
                results.style.display = "none";

                return;
            }

            const startsWithMatches = [];
            const containsMatches = [];

            document.querySelectorAll(".item-label").forEach(element => {
                    const text = element.textContent.trim();

                    //Trim the emojis ... This is because i have 📄current_status for example and i want to find something which starts with c.
                    const searchableText = text.replace(/^[^\w]+/, "").trim();
                    const lowerText = searchableText.toLowerCase();

                    if(lowerText.startsWith(value)){

                        startsWithMatches.push({
                            element,
                            name: searchableText,
                            path: buildPath(element)
                        });

                    }
                    else if(lowerText.includes(value)){

                        containsMatches.push({
                            element,
                            name: text,
                            path: buildPath(element)
                        });

                    }

                });

            startsWithMatches.sort((a,b) =>a.name.localeCompare(b.name));
            containsMatches.sort((a,b) =>a.name.localeCompare(b.name));


            const matches = [];

            startsWithMatches.forEach(match => {matches.push(match);});
            containsMatches.forEach(match => {matches.push(match);});
                

            if(matches.length === 0){
                results.style.display = "block";
                results.innerHTML = `
                                    <div id="no-clusters-found">
                                        No results found.
                                    </div>
                                `;

                return;
            }

            window.searchMatches = matches;
            results.style.display = "block";

            matches.forEach((match,index) => {
                results.innerHTML += `<div class="global-search-result" data-index="${index}">
                                            <div class="global-search-name">
                                                📄 ${match.name}
                                            </div>
                                            <div class="global-search-path">
                                                📁 ${match.path}
                                            </div>
                                        </div>`;

            });

        });

});

function buildPath(element){
    const path = [];
    let current = element.closest("li");

    while(current){
        const folder = current.querySelector(":scope > .folder-label");

        if(folder){
            path.unshift(folder.textContent.replace("📁","").trim());
        }

        current = current.parentElement ?.closest("li");

    }

    return path.join(" / ");

}

document.addEventListener("click",function(e){
        const result = e.target.closest(".global-search-result");

        if(!result){
            return;
        }

        const index = parseInt(result.dataset.index);
        const target = window.searchMatches[index].element;

        target.click();
        document.getElementById("global-search").value = "";
        document.getElementById("global-search-results").style.display ="none";
        document.getElementById("global-search-results").innerHTML = "";

});