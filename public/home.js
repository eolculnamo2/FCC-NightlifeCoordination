
var photoArray = [
	 "https://cdn.glitch.com/d3f7c512-e80f-4797-b96d-dbdd30012294%2Fnightlife.jpeg?1510192124481",
	 "https://cdn.glitch.com/d3f7c512-e80f-4797-b96d-dbdd30012294%2Fphoto1.jpeg?1510192133993",
	 "https://cdn.glitch.com/d3f7c512-e80f-4797-b96d-dbdd30012294%2Fphoto2.jpeg?1510192139600",
	 "https://cdn.glitch.com/d3f7c512-e80f-4797-b96d-dbdd30012294%2Fphoto3.jpeg?1510192141212",
	 "https://cdn.glitch.com/d3f7c512-e80f-4797-b96d-dbdd30012294%2Fphoto4.jpeg?1510192143949"
]

if(window.innerWidth > 1000){
var i = 0;
setInterval(function(){
	if(i<photoArray.length-1){
		i++;
		}
		else{
			i=0	
			}
$("#wrapper").css({"background":'url('+photoArray[i]+')no-repeat',
                  "background-size":"cover"});
}, 3000)
  
}