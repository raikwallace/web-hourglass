async function limitTime() {
    console.log("hello from limit-time.js")

    chrome.storage.sync.get("limitedDomains", (data) => {
        data.limitedDomains.forEach(url => {
            if (window.location.hostname.includes(url)) {
                window.location.assign("https://giphy.com/embed/l1KueCvasUHHQVI64");
            }

        })
    })

}

window.onload = (event) => {
    setInterval(() => {
        chrome.storage.sync.get("limitedDomains", (limitedDomains) => {
            if (!limitedDomains) {
                return;
            }
            limitedDomains.limitedDomains.forEach(url => {
                if (window.location.hostname.includes(url)) {
                    chrome.storage.sync.get("usedTimeSec", (usedTimeSec) => {
                        chrome.storage.sync.get("lastDay", (lastDay) => {
                            if (lastDay.lastDay != new Date().getDate()) {
                                chrome.storage.sync.set({ usedTimeSec: 0, lastDay: new Date().getDate(), extraTime: false, halfTimeAlert: false})
                            }
                            chrome.storage.sync.set({ usedTimeSec: usedTimeSec.usedTimeSec + 5, lastDay: new Date().getDate() })
                            chrome.storage.sync.get("timeSec", (timeSec) => {
                                if (timeSec.timeSec != 0 && usedTimeSec.usedTimeSec + 5 > timeSec.timeSec) {
                                    limitTime()
                                } else if (timeSec.timeSec != 0 && timeSec.timeSec/(usedTimeSec.usedTimeSec + 5)<= 2 ) {
                                    chrome.storage.sync.get("halfTimeAlert", (halfTimeAlert) => {
                                        if (halfTimeAlert.halfTimeAlert) {
                                            return;
                                        } else {
                                            window.alert("You have used 50% of your time!")
                                            chrome.storage.sync.set({ halfTimeAlert: true });
                                        }
                                    });
                                }
                            });
                        })
                    })
                }
            }
            )
        }
        )
    }, 5_000)
}

chrome.storage.sync.get("timeSec", (timeSec) => {
    chrome.storage.sync.get("usedTimeSec", (usedTimeSec) => {
        chrome.storage.sync.get("lastDay", (lastDay) => {
            if (lastDay.lastDay != new Date().getDate()) {
                chrome.storage.sync.set({ usedTimeSec: 0, lastDay: new Date().getDate(), extraTime: false, halfTimeAlert: false })
                return;
            }
            if (timeSec.timeSec == 0) {
                return;
            }
            if (usedTimeSec.usedTimeSec > timeSec.timeSec) {
                limitTime()
            }
        })
    })
})
