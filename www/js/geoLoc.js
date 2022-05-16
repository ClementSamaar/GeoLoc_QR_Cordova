let locPermission = cordova.plugins.permissions;
let O_geoLocPermissionBtn = document.getElementById("geoLocPermissionBtn");
let O_qrCodeReaderBtn = document.getElementById("qrCodeReaderBtn");
let O_geoLocPermissionStatus = document.getElementById("geoLocPermissionStatus");
let O_longDiv = document.getElementById("long");
let O_latDiv = document.getElementById("lat");
let O_longValue = document.getElementById("longValue");
let O_latValue = document.getElementById("latValue");

let locPermissionList = [
   locPermission.ACCESS_COARSE_LOCATION,
   locPermission.ACCESS_FINE_LOCATION
];

O_geoLocPermissionBtn.addEventListener("click", () => {
   checkPermissions();
});

O_qrCodeReaderBtn.addEventListener("click", () => {
   window.location.assign("index.html");
});

switchLocDisplay(0);
checkPermissions();

function checkPermissions() {
   locPermission.checkPermission(locPermission.ACCESS_COARSE_LOCATION, checkSuccess, checkError);
   locPermission.checkPermission(locPermission.ACCESS_FINE_LOCATION, checkSuccess, checkError);

   function checkSuccess(status) {
      O_geoLocPermissionStatus.setAttribute("class", "hidden");
      if (!status.hasPermission) checkError();
      else switchIndexDisplay(1);
   }

   function checkError() {
      requestPermission();
      alert("La localisation GPS n'est pas activée");
      switchLocDisplay(0);
      O_geoLocPermissionStatus.removeAttribute("class");
      O_geoLocPermissionStatus.innerText = "La localisation GPS n'est pas activée";
   }
}

function requestPermission() {
   locPermission.requestPermissions(locPermissionList, requestSuccess, requestError);

   function requestSuccess(status) {
      O_geoLocPermissionStatus.setAttribute("class", "hidden");
      if (!status.hasPermission) requestError();
      else switchLocDisplay(1);
   }

   function requestError() {
      switchLocDisplay(0);
      O_geoLocPermissionStatus.removeAttribute("class");
      O_geoLocPermissionStatus.innerText = "La localisation GPS n'est pas activée";
   }
}

function switchLocDisplay(numDisplay) {
   switch (numDisplay) {
      case 0 :
         O_geoLocPermissionBtn.setAttribute("class", "customBtn");
         O_longDiv.setAttribute("class", "hidden");
         O_latDiv.setAttribute("class", "hidden");
         break;
      case 1 :
         O_geoLocPermissionBtn.setAttribute("class", "hidden");
         O_longDiv.removeAttribute("class");
         O_latDiv.removeAttribute("class");
         break;
   }
}