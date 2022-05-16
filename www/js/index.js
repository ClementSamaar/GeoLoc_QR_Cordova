/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    if (window.location.pathname.split("/")[1] === "index.html") {
        console.log("INDEX");
        let O_QrScanner = window.QRScanner;
        let O_h1 = document.querySelector("h1");
        let O_camPermissionBtn = document.getElementById("cameraPermissionBtn");
        let O_scanQrCodeBtn = document.getElementById("scanQrCodeBtn");
        let O_pPermissionStatus = document.getElementById("qrCodeReaderStatus");
        let O_stopQrCodeBtn = document.getElementById("stopQrCodeBtn");
        let O_geoLocBtn = document.getElementById("geoLocBtn");
        let S_qrCodeContent;

        O_QrScanner.prepare(onDone);

        O_camPermissionBtn.addEventListener("click", () => {
            O_QrScanner.prepare(onDone);
        });

        O_scanQrCodeBtn.addEventListener("click", () => {
            switchIndexDisplay(2);
            document.body.style.backgroundColor = 'transparent';
            O_QrScanner.show();
            O_QrScanner.scan(callback);
        });

        O_stopQrCodeBtn.addEventListener("click", () => {
            O_QrScanner.destroy();
            switchIndexDisplay(1);
        });

        O_geoLocBtn.addEventListener("click", () => {
            window.location.assign("geoloc.html");
        });

        function onDone(err, status) {
            if (err) {
                if (err.name === "CAMERA_ACCESS_DENIED") {
                    switchIndexDisplay(0);
                    O_pPermissionStatus.removeAttribute("class");
                    O_pPermissionStatus.innerText = "L'utilisation de la caméra à été refusée. Vous ne pourrez pas utiliser l'application.";
                    alert("L'utilisation de la caméra à été refusée. Vous ne pourrez pas utiliser l'application.");
                }
                console.log(err);
            } else {
                switchIndexDisplay(1);
            }
        }

        let callback = function (err, contents) {
            if (err) {
                console.error(err);
            }
            O_QrScanner.destroy();
            switchIndexDisplay(1);
            S_qrCodeContent = contents;
            O_pPermissionStatus.innerText = S_qrCodeContent;
            O_pPermissionStatus.removeAttribute("class");
        };

        function switchIndexDisplay(numDisplay) {
            switch (numDisplay) {
                case 0 :
                    O_h1.removeAttribute("class");
                    O_camPermissionBtn.setAttribute("class", "customBtn");
                    O_scanQrCodeBtn.setAttribute("class", "hidden");
                    O_stopQrCodeBtn.setAttribute("class", "hidden");
                    O_geoLocBtn.setAttribute("class", "customBtn");
                    break;
                case 1 :
                    O_h1.removeAttribute("class");
                    O_camPermissionBtn.setAttribute("class", "hidden");
                    O_scanQrCodeBtn.setAttribute("class", "customBtn");
                    O_stopQrCodeBtn.setAttribute("class", "hidden");
                    O_pPermissionStatus.setAttribute("class", "hidden");
                    O_geoLocBtn.setAttribute("class", "customBtn");
                    break;
                case 2 :
                    O_h1.setAttribute("class", "hidden");
                    O_camPermissionBtn.setAttribute("class", "hidden");
                    O_scanQrCodeBtn.setAttribute("class", "hidden");
                    O_stopQrCodeBtn.setAttribute("class", "customBtn");
                    O_pPermissionStatus.setAttribute("class", "hidden");
                    O_geoLocBtn.setAttribute("class", "customBtn");
                    break;
            }
        }
    }
    else if (window.location.pathname.split("/")[1] === "geoloc.html"){
        console.log("GEOLOC");
        let locPermission = cordova.plugins.permissions;
        let geoLoc = navigator.geolocation;
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
            locPermission.checkPermission(locPermission.ACCESS_FINE_LOCATION, checkSuccess, checkError);

            function checkSuccess(status) {
                if (!status.hasPermission) checkError();
                else {
                    switchLocDisplay(1);
                    displayLocation();
                }
            }

            function checkError() {
                alert("La localisation GPS n'est pas activée");
                switchLocDisplay(0);
                O_geoLocPermissionStatus.removeAttribute("class");
                O_geoLocPermissionStatus.innerText = "La localisation GPS n'est pas activée";
                requestPermission();
            }
        }

        function requestPermission() {
            locPermission.requestPermissions(locPermissionList, requestSuccess, requestError);

            function requestSuccess(status) {
                if (!status.hasPermission) requestError();
                else {
                    switchLocDisplay(1);
                    displayLocation();
                }
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

        function displayLocation(){
            geoLoc.getCurrentPosition(geoLocSuccess, geoLocError);
            function geoLocSuccess(location){
                O_longValue.innerText = String(location.coords.longitude);
                O_latValue.innerText = String(location.coords.latitude);
            }

            function geoLocError(err){
                console.warn(err);
                O_geoLocPermissionStatus.removeAttribute("class");
                O_geoLocPermissionStatus.innerText = err;
            }
        }
    }
}