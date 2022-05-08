async function login() {

    let formData = new FormData();
    formData.append("api_key", document.getElementById("keybox").value)

    let usrout;
    let imgout;

    fetch("https://localhost:7247/api/usr",
        {
            body: formData,
            method: "post"
        }).then(res => res.json())
        .then(
            data => {
                usrout = data
                document.getElementById("loginstat").innerHTML = "api key:"
                document.getElementById("loginarea").style.display = "none"
                document.getElementById("stats").style.display = "initial"
                document.getElementById("wide").style.display = "flex"

                document.getElementById("username").innerHTML = usrout["username"]
                document.getElementById("uid").innerHTML = usrout["uid"]
                document.getElementById("domain").innerHTML = usrout["domain"]
            })
        .catch(e => document.getElementById("loginstat").innerHTML = "invalid key")

    fetch("https://localhost:7247/api/img",
        {
            body: formData,
            method: "post"
        }).then(res => res.json())
        .then(
            data => {
                console.log(data)
                imgout = data

                document.getElementById("files").innerHTML = usrout["uploadCount"] + " files uploaded"
                document.getElementById("gb").innerHTML = bytes(usrout["uploadedBytes"]) + " used"
                document.getElementById("time").innerHTML = changeToTime(Math.round((new Date().getTime() - Date.parse(data[data.length - 1]["timestamp"])) / 1000 / 60)) + " since last upload"
            
                data.foreach(img => {
                    console.log(img["hash"])
                    var item = document.createElement("img");
                    item.src = img["hash"]
                    document.getElementById("images").appendChild(item)
                })
            })
        .catch(e => document.getElementById("dashboard").innerHTML = "dashboard")

}

function bytes(x) {
    if (x < 1024) {
        return (numberWithCommas(x) + " bytes")
    }
    if (x >= 1024 && x < 1048576) {
        return (numberWithCommas(Math.round(x / 1024)) + " kilobytes")
    }
    if (x >= 1048576 && x < 1073741824) {
        return (numberWithCommas(Math.round(x / 1024 / 10.24) / 100) + " megabytes")
    }
    if (x >= 1073741824) {
        return (numberWithCommas(Math.round(x / 1024 / 1024 / 10.24) / 100) + " gigabytes")
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function changeToTime(x) {
    if (x < 60) {
        return (x == 1 ? (x + " minute") : x + " minutes")
    }
    else if (x >= 60 && x < 1440) {
        x = Math.round(x / 6) / 10
        return (x == 1 ? (x + " hour") : x + " hours")
    }
    else if (x >= 1440) {
        x = Math.round(x / 1440)
        return (x == 1 ? (x + " day") : x + " days")
    }
}