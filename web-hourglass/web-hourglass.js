function saveDomain(url) {
  chrome.storage.sync.get("limitedDomains", (data) => {
    const limitedDomains = data.limitedDomains || [];
    if (limitedDomains.includes(url)) {
      return;
    }
    limitedDomains.push(url);
    chrome.storage.sync.set({ limitedDomains });
  });
}

const buttonAddIt = document.querySelector("button#addIt");
buttonAddIt.addEventListener("click", async () => {
  const domain = document.querySelector("input#url").value;
  saveDomain(domain);
  window.location.reload();
});

const buttonAddThis = document.querySelector("button#addThis");
buttonAddThis.addEventListener("click", async () => {

    chrome.tabs.query({"active": true}, tab => { 
        const domain = new URL(tab[0].url).hostname;
        saveDomain(domain);
        window.location.reload();
    });
});

document.querySelector("button#changeTime").addEventListener("click", async (event) => {
    chrome.storage.sync.get("pin", (data) => {
        const pin = data.pin || "0000";
        if (document.querySelector("input#pinTime").value == pin) {
          const timeSec = document.querySelector("input#timeLimiter").value * 60;
          chrome.storage.sync.set({ timeSec });
          alert("Time limit changed to " + timeSec / 60 + " minutes");
          window.location.reload();
        } else {
          alert("Wrong pin");
        }
    });
});

document.querySelector("button#setPin").addEventListener("click", async (event) => {
    const pin = document.querySelector("input#pin").value;
    const repeatedPin = document.querySelector("input#repeatedPin").value;
    if (pin != repeatedPin) {
        const feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        feedback.textContent = "Pin doesn't match";
        document.querySelector("input#pin").className = "form-control is-invalid";
        document.querySelector("input#repeatedPin").className = "form-control is-invalid";
        document.querySelector("div#setPinGroup").className = "input-group mb-3 is-invalid"
        document.querySelector("button#setPin").className = "form-control btn btn-primary is-invalid";
        document.querySelector("div#setPinGroup").appendChild(feedback);
        return;
    }
    chrome.storage.sync.set({ pin });
    window.location.reload();
});

document.querySelector("button#removeLimitedDomains").addEventListener("click", async (event) => {
  chrome.storage.sync.get("pin", (data) => {
    const pin = data.pin || "0000";
    if (document.querySelector("input#pinDomains").value == pin) {
      domainsToRemove = [];
      event.target.form.querySelectorAll("input").forEach(input => {
        if (input.type == "checkbox" && input.checked) {
          domainsToRemove.push(input.id);
        }
      }
      )
      chrome.storage.sync.get("limitedDomains", (data) => {
        const limitedDomains = data.limitedDomains || [];
        const newLimitedDomains = limitedDomains.filter(domain => !domainsToRemove.includes(domain));
        chrome.storage.sync.set({ limitedDomains: newLimitedDomains });
      });
    } else {
      alert("Wrong pin");
    }
  });
});

chrome.storage.sync.get("pin", (data) => {
    if (!data.pin) {
        document.querySelector("div#main").remove();
    } else {
        document.querySelector("div#pin").remove();
    }
});

chrome.storage.sync.get("limitedDomains", (data) => {
    
    if (!data.limitedDomains || data.limitedDomains.length == 0) {
      if (!document.querySelector("div#limitedDomains")) {
        return;
      }
      document.querySelector("div#limitedDomains").appendChild(document.createElement("li")).textContent = "No domains added yet!";
      document.querySelector("div#removeLimitedDomains").remove();
      return;
    }
    data.limitedDomains.forEach(url => {
        const input = document.createElement("input");
        input.className = "form-check-input me-1";
        input.type = "checkbox";
        input.id = url;
        const li = document.createElement("label");
        li.className = "list-group-item";
        li.appendChild(input);
        li.append(url);
        document.querySelector("div#limitedDomains").appendChild(li);
    });
});

chrome.storage.sync.get("timeSec", (data) => {
  if (!document.querySelector("input#timeLimiter")) {
    return;
  }
  document.querySelector("input#timeLimiter").placeholder = (data.timeSec / 60) || 0;
  if (!data.timeSec || data.timeSec == 0) {
    document.querySelector("div#timeLeft").remove();
    return;
  }
  chrome.storage.sync.get("usedTimeSec", (usedTimeSec) => {
    const minutesLeft = Math.round((data.timeSec / 60) - ((usedTimeSec.usedTimeSec || 0)/ 60));
    const alert = document.querySelector("div#timeLeft")
    alert.textContent = "Time left: " + minutesLeft + " minutes";
    if (minutesLeft <= 0) {
      alert.className = alert.className + " alert-danger";
      buttonAddMoreTime = document.createElement("button");
      buttonAddMoreTime.id = "addMoreTime";
      buttonAddMoreTime.className = "btn btn-primary";
      buttonAddMoreTime.textContent = "Add 5 more minutes, please!";
      buttonAddMoreTime.addEventListener("click", async () => {
        chrome.storage.sync.get("usedTimeSec", (buttonUsedTimeSec) => {
          const usedTimeSec = buttonUsedTimeSec.usedTimeSec - 300;
          chrome.storage.sync.set({ usedTimeSec });
          window.alert("Added 5 minutes more! Use them wisely!");
          window.location.reload();
        });
      });
      alert.append(buttonAddMoreTime);
    } else if (minutesLeft < 10) {
      alert.className = alert.className + " alert-warning";
    } else {
      alert.className = alert.className + " alert-primary";
    }
  });
});
