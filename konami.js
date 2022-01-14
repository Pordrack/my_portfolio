//https://gomakethings.com/how-to-create-a-konami-code-easter-egg-with-vanilla-js/
const body=document.querySelector("body");
const mainCanva=document.querySelector("#mainCanva")
let pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let current = 0;
const iframes=document.querySelectorAll("iframe");
const iframeContainers=document.querySelectorAll(".iframe-container");

let keyHandler = function (event) {
	// If the key isn't in the pattern, or isn't the current key in the pattern, reset
	if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
		current = 0;
		return;
	}

	// Update how much of the pattern is complete
	current++;

	// If complete, alert and reset
	if (pattern.length === current) {
		current = 0;
		window.alert('Raccoon time !');
        body.classList.add("raccoon");
        mainCanva.classList.add("hidden");
        for(iframeContainer of iframeContainers){
            iframeContainer.style.paddingTop=(100*(dimensions['youtubeVideo'].height/dimensions['youtubeVideo'].width))+"%";
        }
        for(iframe of iframes){
            iframe.innerHTML="https://www.youtube.com/embed/FTcjzaqL0pE";
            hideAllProjects(null);
        }
	}
};

// Listen for keydown events
document.addEventListener('keydown', keyHandler, false);
